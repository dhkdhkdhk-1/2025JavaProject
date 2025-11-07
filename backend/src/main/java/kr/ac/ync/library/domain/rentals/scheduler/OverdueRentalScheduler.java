package kr.ac.ync.library.domain.rentals.scheduler;

import kr.ac.ync.library.domain.rentals.dto.RentalResponse;
import kr.ac.ync.library.domain.rentals.service.RentalService;
import kr.ac.ync.library.global.common.mail.service.MailService;
import kr.ac.ync.library.global.common.mail.util.MailTemplateUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OverdueRentalScheduler {

    private final RentalService rentalService;
    private final MailService mailService;

    /**
     * 매일 오전 9시 자동 발송
     */
    @Scheduled(cron = "0 0 9 * * *")
    public void sendOverdueMailAutomatically() {
        List<RentalResponse> overdueRentals = rentalService.findOverdueRentals();
        if (overdueRentals.isEmpty()) {
            log.info("延滞中の貸出はありません - メール送信をスキップします。");
            return;
        }

        for (RentalResponse rental : overdueRentals) {
            String subject = "【返却案内】" + rental.getBookTitle();
            String text = MailTemplateUtil.buildOverdueMailBody(rental);
            mailService.sendEmail(rental.getUserEmail(), subject, text);
            log.info("📨 自動送信完了: {}", rental.getUserEmail());
        }

        log.info("✅  延滞者への自動メール送信完了（{}件）", overdueRentals.size());
    }
}
