package kr.ac.ync.library.domain.board.service;

import kr.ac.ync.library.domain.board.entity.BoardEntity;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import java.util.List;

public interface BoardService {

    List<BoardEntity> getAllBoards(); // 전체 게시글 조회

    BoardEntity getBoard(Long id); // 특정 게시글 ID로 조회

    BoardEntity createBoard(BoardEntity board); // 게시글 작성

    BoardEntity updateBoard(Long id, BoardEntity updatedBoard, UserEntity currentUser); // 게시글 수정

    void deleteBoard(Long id, UserEntity currentUser); // 게시글 삭제

    List<BoardEntity> getBoardsByTypeAndTitle(String type, String title); // 카테고리 + 제목 검색

}
