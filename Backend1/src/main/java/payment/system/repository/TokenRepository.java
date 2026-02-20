package payment.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import payment.system.model.UserToken;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<UserToken, Long> {
    Optional<UserToken> findByToken(String token);

    Optional<UserToken> findByUserId(Long userId);

}
