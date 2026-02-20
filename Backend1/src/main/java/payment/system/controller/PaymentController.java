package payment.system.controller;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.LuminanceSource;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.Result;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import payment.system.dto.TransactionDTO;
import payment.system.dto.TransactionWrapper;
import payment.system.model.Transaction;
import payment.system.model.UserToken;
import payment.system.repository.TokenRepository;
import payment.system.repository.TransactionRepository;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {


    private String decodeQR(MultipartFile file, Double Amount ) throws Exception {

        InputStream inputStream = file.getInputStream();
        BufferedImage bufferedImage = ImageIO.read(inputStream);

        LuminanceSource source =
                new BufferedImageLuminanceSource(bufferedImage);

        BinaryBitmap bitmap =
                new BinaryBitmap(new HybridBinarizer(source));

        Result result = new MultiFormatReader().decode(bitmap);

        return result.getText()+"&am="+Amount.toString()+"&cu=INR";
    }

    private final TransactionRepository transactionRepository;
    private final TokenRepository tokenRepository;

    public PaymentController(TransactionRepository transactionRepository,
             TokenRepository tokenRepository) {
        this.transactionRepository = transactionRepository;
        this.tokenRepository=tokenRepository;
    }

    @PostMapping(value = "/bulk", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadBulk(@ModelAttribute TransactionWrapper wrapper) throws Exception {

        for (TransactionDTO t : wrapper.getTransactions()) {

            System.out.println(t.getUserId());

            MultipartFile file = t.getQrImage();

            if (file != null && !file.isEmpty()) {

                String decodedText = decodeQR(file,t.getAmount());

                Transaction transaction = new Transaction();
                transaction.setUserId(t.getUserId());
                transaction.setIndexId(t.getIndexId());
                transaction.setRecipient(t.getRecipient());
                transaction.setAmount(t.getAmount());
                transaction.setQr_url(decodedText);
                transaction.setStatus("SYNCED");
                transaction.setCreatedAt(LocalDateTime.now());

                transactionRepository.save(transaction);
            }
        }

        return ResponseEntity.ok("Uploaded successfully");
    }

    @PostMapping("/save-token")
    public ResponseEntity<?> saveToken(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String userId=body.get("userId");

        // Save token in DB against user
//        tokenRepository.save(new UserToken(token));
        Optional<UserToken> existing =
                tokenRepository.findByToken(token);

        if (existing.isPresent()) {
            // Update userId if needed
            UserToken ut = existing.get();
            ut.setUserId(Long.valueOf(userId));
            tokenRepository.save(ut);
        } else {
            tokenRepository.save(new UserToken(Long.valueOf(userId), token));
        }


        return ResponseEntity.ok("Token saved");
    }


    @PostMapping("/send-test")
    public ResponseEntity<?> sendTestNotification(@RequestBody Map<String, String> body)
            throws FirebaseMessagingException {

        String token = body.get("token");

        String upiLink = "upi://pay?pa=omkumavat20041@ybl&pn=OM%20SUNIL%20KUMAVAT&am=10&cu=INR";

        Message message = Message.builder()
                .setToken(token)
                .setNotification(Notification.builder()
                        .setTitle("Complete Payment")
                        .setBody("Tap to open UPI app")
                        .build())
                .putData("upiLink", upiLink)
                .build();

        String response = FirebaseMessaging.getInstance().send(message);

        System.out.println(response);

        return ResponseEntity.ok(response);
    }


    @PostMapping("/notification-clicked")
    public ResponseEntity<?> handleClick(@RequestBody Map<String, String> body) {

        String txnId = body.get("txnId");
        if(txnId==null) return ResponseEntity.ok("Recorded");
        System.out.println("clicked"+10);

       Optional<Transaction> txn = transactionRepository.findById(Long.valueOf(txnId));

       if(txn.isPresent()){
           Transaction txx=txn.get();

           txx.setStatus("SUCCESS");
           transactionRepository.save(txx);
       }



        return ResponseEntity.ok("Recorded");
    }

    @GetMapping("/get-pending-payments")
    public ResponseEntity<?>  handlePendingPayments(@RequestParam("id") Integer userId){
//        String userId=body.get("userId");

        List<Transaction> txn=transactionRepository.findByUserId(Long.valueOf(userId));

        return ResponseEntity.ok(txn);
    }

}
