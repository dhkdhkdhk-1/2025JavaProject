package kr.ac.ync.library.domain.books.mapper;

import kr.ac.ync.library.domain.books.dto.BookModRequest;
import kr.ac.ync.library.domain.books.dto.BookRegisterRequest;
import kr.ac.ync.library.domain.books.dto.BookResponse;
import kr.ac.ync.library.domain.books.entity.BookEntity;

public class BookMapper {
    public static BookEntity toEntity(BookRegisterRequest request){
        return BookEntity.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .author(request.getAuthor())
                .build();
    }

    public static void updateEntity(BookModRequest dto, BookEntity entity) {
        entity.modify(dto.getTitle(), dto.getAuthor(), dto.getPublisher(), dto.getCategory(), dto.isAvailable());
    }

    public static BookResponse toResponse(BookEntity entity) {
        return BookResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .author(entity.getAuthor())
                .publisher(entity.getPublisher())
                .category(entity.getCategory())
                .available(entity.isAvailable())
                .createdDateTime(entity.getCreatedDateTime())
                .modifiedDateTime(entity.getModifiedDateTime())
                .build();
    }
}
