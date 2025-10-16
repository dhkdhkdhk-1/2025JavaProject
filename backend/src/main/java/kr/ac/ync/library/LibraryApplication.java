package kr.ac.ync.library;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class LibraryApplication {

	public static void main(String[] args) {
        System.out.println("1");
        SpringApplication.run(LibraryApplication.class, args);
	}

}
