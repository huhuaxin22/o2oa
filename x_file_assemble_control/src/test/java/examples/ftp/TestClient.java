package examples.ftp;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.collections4.set.ListOrderedSet;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.net.ftp.FTPClient;
import org.junit.Test;

import com.sun.tools.javac.util.StringUtils;

public class TestClient {

	@Test
	public void test() {
		try {
			String name = "aaaa";
			System.out.println(StringUtils.toLowerCase(FilenameUtils.getExtension(name)));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Test
	public void test2() {
		try {
			ListOrderedSet<String> set = new ListOrderedSet<>();
			set.add("ddddd");
			set.remove("dddddddd");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Test
	public void testBoolean() {
		Pattern pattern = Pattern.compile("/download/(\\S+)$");
		Matcher matcher = pattern.matcher("/servlet/download");
		if (matcher.find()) {
			System.out.println(matcher.group(1));
		} else {
			System.out.println("XXXXXXXXXXX");
		}
	}

	@Test
	public void test1() throws Exception {
		System.out.println(FilenameUtils.getName("d:/aaaa/bb/11.txt"));
	}
}
