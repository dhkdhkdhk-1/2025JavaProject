package kr.ac.ync.library.domain.rentals.email.service;

public interface EmailLogService {
    void recordLog(String recipient, String subject, String content);
}
