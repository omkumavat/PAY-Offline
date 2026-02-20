package payment.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import payment.system.model.Transaction;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByStatus(String pending);

    List<Transaction> findByUserId(Long aLong);

//    TransactionRepository findByUserId();
}
