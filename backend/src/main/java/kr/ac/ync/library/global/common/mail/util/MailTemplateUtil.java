package kr.ac.ync.library.global.common.mail.util;

import kr.ac.ync.library.domain.rentals.dto.RentalResponse;
import lombok.experimental.UtilityClass;

@UtilityClass
public class MailTemplateUtil {

    public static String buildOverdueMailBody(RentalResponse rental) {
        return """
        안녕하세요, %s 님

        대여하신 도서 "%s"의 반납 예정일은 %s 입니다.
        반납일이 지나 연체로 처리되었으니 빠른 반납 부탁드립니다.

        감사합니다.
        - 영남이공대학교 도서관리 시스템
        """.formatted(
                rental.getUserName(),
                rental.getBookTitle(),
                rental.getDueDate().toLocalDate()
        );
    }
}
