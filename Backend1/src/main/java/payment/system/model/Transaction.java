package payment.system.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long indexId;

    private Long userId;

    private String recipient;

    private Double amount;

    private String qr_url;

    private LocalDateTime createdAt;

    private String status;

    // Getters and Setters

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIndexId() { return indexId; }
    public void setIndexId(Long indexId) { this.indexId = indexId; }

    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime timestamp) { this.createdAt = timestamp; }

//    public MultipartFile getQrImage() { return qrImage; }
//    public void setQrImage(MultipartFile qrImage) { this.qrImage = qrImage; }

    public String getQr_url() { return qr_url; }
    public void setQr_url(String qr_url) { this.qr_url = qr_url; }


}

