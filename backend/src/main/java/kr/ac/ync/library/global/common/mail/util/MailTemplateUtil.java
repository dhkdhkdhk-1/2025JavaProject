package kr.ac.ync.library.global.common.mail.util;

import kr.ac.ync.library.domain.rentals.dto.RentalResponse;
import lombok.experimental.UtilityClass;

@UtilityClass
public class MailTemplateUtil {

    public static String buildOverdueMailBody(RentalResponse rental) {
        return """
                こんにちは、%s様
                
                お借りになった本「%s」の返却予定日は %sです。
                返却日を過ぎていますので、早めのご返却をお願いいたします。
                
                ご協力ありがとうございます。
                
                — 永南工科大学 図書管理システム
        """.formatted(
                rental.getUserName(),
                rental.getBookTitle(),
                rental.getDueDate().toLocalDate()
        );
    }
}
