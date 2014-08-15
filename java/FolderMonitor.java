import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.Date;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;



public class FolderMonitor  {

	// JDBC driver name and database URL
	static final String DB_URL = "jdbc:sap://localhost:30015/?currentschema=NEO_CG2SX3P5XHHQEO58DKM7BWU0V";

	//  Database credentials
	static String USER;
	static String PASS;
	static final String IMGFolder = "C:\\java\\imageWA";

	public static void main(String[] args) throws IOException, InterruptedException, Exception, IOException, SQLException {


		Properties prop = new Properties();
		InputStream input = null;
 
		try {
 
			input = new FileInputStream("config.properties");
			prop.load(input);
			USER = prop.getProperty("user");
			PASS = prop.getProperty("pwd");

		} catch (IOException ex) {
			ex.printStackTrace();
		} finally {
			if (input != null) {
				try {
					input.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

		Path imgFolder = Paths.get(IMGFolder);
		WatchService watchService = FileSystems.getDefault().newWatchService();
		imgFolder.register(watchService, StandardWatchEventKinds.ENTRY_CREATE);
		
		Class.forName("com.sap.db.jdbc.Driver");
		Connection conn = DriverManager.getConnection(DB_URL,USER,PASS);
		conn.setAutoCommit(false);


		boolean valid = true;
		do {
			WatchKey watchKey = watchService.take();

			for (WatchEvent event : watchKey.pollEvents()) {
				WatchEvent.Kind kind = event.kind();
				if (StandardWatchEventKinds.ENTRY_CREATE.equals(event.kind())) {
					String fileName = event.context().toString();
					System.out.println("File Created:" + fileName);

					try {
						Thread.sleep(5 * 1000);                
					} catch(InterruptedException ex) {
						Thread.currentThread().interrupt();
					}
					MyThread myThread = new MyThread(conn, fileName);
					
				}
			}
			valid = watchKey.reset();

		} while (valid);

	}


	public static class MyThread extends Thread {
		Connection conn = null;
		String fileName = null;

		String INSERT_PICTURE = "INSERT INTO \"NEO_CG2SX3P5XHHQEO58DKM7BWU0V\".\"p1940803061trial.fd2.data::mytable\" VALUES(?,?)";

		 MyThread (Connection conn, String fileName) {
			this.conn = conn;
			this.fileName = fileName;
			Thread t = new Thread(this,"Whana");
			t.start();
		}


		public synchronized void run ()  {
			try {
				insert(fileName);
			} catch(Exception e){
				System.out.println(e);
			}

		}

		public synchronized void insert(String fileName) throws Exception, IOException, SQLException{
			FileInputStream fis = null;
			PreparedStatement ps = null;

			Date currentDate = new Date();
			String s = Long.toString(currentDate.getTime() / 1000);
			System.out.println(s);

			try {
				System.out.println("filename: " + fileName);
				File file = new File(IMGFolder + "\\" + fileName);
				fis = new FileInputStream(file);
				ps = conn.prepareStatement(INSERT_PICTURE);
				ps.setString(1, s);
				ps.setBinaryStream(2, fis, (int) file.length());
				int rowsInserted = ps.executeUpdate();
				conn.commit();

				if (rowsInserted > 0) {
					System.out.println("A new record was inserted successfully!");
				}

				if(file.delete()){
					System.out.println(file.getName() + " is deleted!");
				}
				else{
    				System.out.println("Delete operation is failed.");
    			}

			} finally {
				ps.close();
				fis.close();
			}
		}

	}
}
