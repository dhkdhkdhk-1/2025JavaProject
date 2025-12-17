package kr.ac.ync.library.domain.cs.entity.category;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CsCategory {

    BOOK("도서 관련"),
    ACCOUNT("계정 관련"),
    ETC("기타");

    private final String csCategory;
}
