package payment.system.dto;

import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

public class TransactionDTO {

    private Long id;
    private Long userId;
    private Long indexId;
    private String recipient;
    private Double amount;
    private LocalDateTime createdAt;
    private String qr_url;
    private MultipartFile qrImage;

    public Long getIndexId() { return indexId; }
    public void setIndexId(Long indexId) { this.indexId = indexId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public LocalDateTime getCratedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime timestamp) { this.createdAt = timestamp; }

    public MultipartFile getQrImage() { return qrImage; }
    public void setQrImage(MultipartFile qrImage) { this.qrImage = qrImage; }

    public String getQr_url() { return qr_url; }
    public void setQr_url(String qr_url) { this.qr_url = qr_url; }

}
