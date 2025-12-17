package kr.ac.ync.library.domain.books.repository;

import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.books.entity.enums.BookCategory;
import kr.ac.ync.library.domain.branch.exception.BranchNotFoundException;
import kr.ac.ync.library.domain.branch.repository.BranchRepository;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.entity.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BookRepositoryTest {
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private BranchRepository branchRepository;
    @Test
    void bookInsertDummy(){

    }
}