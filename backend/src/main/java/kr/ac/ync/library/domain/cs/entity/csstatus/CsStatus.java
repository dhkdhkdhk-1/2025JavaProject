package kr.ac.ync.library.domain.cs.entity.csstatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CsStatus {
    WAITING("답변 대기"),
    ANSWERING("답변 중"),
    COMPLETED("답변 완료");

    private final String csMessage;
}
