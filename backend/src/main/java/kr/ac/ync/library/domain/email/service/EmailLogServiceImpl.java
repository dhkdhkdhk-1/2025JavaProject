package kr.ac.ync.library.domain.email.service;

import kr.ac.ync.library.domain.email.entity.EmailLogEntity;
import kr.ac.ync.library.domain.email.repository.EmailLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailLogServiceImpl implements EmailLogService{
    private final EmailLogRepository emailLogRepository;
    @Override
    public void recordLog(String recipient, String subject, String content) {
        EmailLogEntity log = EmailLogEntity.builder()
                .recipient(recipient)
                .subject(subject)
                .content(content)
                .build();
        emailLogRepository.save(log);
    }
}
