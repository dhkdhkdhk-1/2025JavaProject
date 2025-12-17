package kr.ac.ync.library.domain.rentals.service;

import jakarta.transaction.Transactional;
import kr.ac.ync.library.domain.books.entity.BookBranchEntity;
import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.books.exception.BookNotFoundException;
import kr.ac.ync.library.domain.books.repository.BookRepository;
import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import kr.ac.ync.library.domain.branch.repository.BranchRepository;
import kr.ac.ync.library.domain.rentals.dto.RentalRegisterRequest;
import kr.ac.ync.library.domain.rentals.dto.RentalResponse;
import kr.ac.ync.library.domain.rentals.entity.RentalEntity;
import kr.ac.ync.library.domain.rentals.exception.RentalNotFoundException;
import kr.ac.ync.library.domain.rentals.mapper.RentalMapper;
import kr.ac.ync.library.domain.rentals.repository.RentalRepository;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.exception.UserNotFoundException;
import kr.ac.ync.library.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class RentalServiceImpl implements RentalService {

    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final BranchRepository branchRepository;

    @Override
    public void register(RentalRegisterRequest request, Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.EXCEPTION);

        BookEntity book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> BookNotFoundException.EXCEPTION);

        BranchEntity branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("지점 없음"));

        BookBranchEntity bookBranch =
                rentalRepository.findBookBranch(book, branch)
                        .orElseThrow(() -> new RuntimeException("해당 지점에 책 없음"));

        if (!bookBranch.isAvailable()) {
            throw new RuntimeException("이미 대여 중");
        }

        RentalEntity rental = RentalMapper.toEntity(user, book, branch);
        rentalRepository.save(rental);

        // 🔥 해당 지점만 대여 불가
        bookBranch.setAvailable(false);
    }

    // 🔥 관리자 반납 처리
    @Override
    public void approveReturn(Long rentalId) {
        RentalEntity rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> RentalNotFoundException.EXCEPTION);

        if (rental.isReturned()) return;

        rental.setReturned(true);
        rental.setReturnDate(LocalDateTime.now());
        rental.setStatus("返却済み");

        BookBranchEntity bookBranch =
                rentalRepository.findBookBranch(
                        rental.getBook(),
                        rental.getBranch()
                ).orElseThrow();

        bookBranch.setAvailable(true);
    }

    @Override
    public List<RentalResponse> getList() {
        return rentalRepository.findAll()
                .stream().map(RentalMapper::toResponse).toList();
    }

    @Override
    public List<RentalResponse> getListByUser(Long userId) {
        return rentalRepository.findByUserId(userId)
                .stream().map(RentalMapper::toResponse).toList();
    }

    @Override
    public List<RentalResponse> findOverdueRentals() {
        return rentalRepository.findOverdueRentals()
                .stream().map(RentalMapper::toResponse).toList();
    }

    @Override
    public RentalResponse findById(Long id) {
        return RentalMapper.toResponse(
                rentalRepository.findById(id)
                        .orElseThrow(() -> RentalNotFoundException.EXCEPTION)
        );
    }
}
