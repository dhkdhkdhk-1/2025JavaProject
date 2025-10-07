package kr.ac.ync.library.domain.books.dto;

import jakarta.persistence.*;
import kr.ac.ync.library.domain.books.entity.enums.BookCategory;

public class Book {
    private Long id;
    private BookCategory category;
    private String title;
    private String author;
    private String publisher;
    private boolean available;
}
