package payment.system.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import payment.system.model.Transaction;
import payment.system.model.UserToken;
import payment.system.repository.TokenRepository;
import payment.system.repository.TransactionRepository;

import java.util.List;

@Service
public class PaymentReminderService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TokenRepository tokenRepository;

//    @Scheduled(fixedRate = 60 * 60 * 1000) // every 1 hour
    @Scheduled(fixedRate = 60 * 60 * 1000)
    public void checkPendingPayments() {

        System.out.println("Checking pending payments...");

        List<Transaction> pending =
                transactionRepository.findByStatus("SYNCED");

        for (Transaction txn : pending) {
            System.out.println(txn.getRecipient());
            tokenRepository.findByUserId(txn.getUserId())
                    .ifPresent(userToken -> {
                        try {
                            sendPush(userToken.getToken(), txn);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    });
        }

    }

    private void sendPush(String token, Transaction txn)
            throws FirebaseMessagingException {

        String upiLink = txn.getQr_url()
                + "&am=" + txn.getAmount()
                + "&cu=INR";

        Message message = Message.builder()
                .setToken(token)
                .putData("txnId", String.valueOf(txn.getId()))
                .putData("title", "Payment Pending")
                .putData("body", "Tap to complete ₹" + txn.getAmount())
                .putData("upiLink", upiLink)
                .build();

        FirebaseMessaging.getInstance().send(message);
    }



    @Scheduled(fixedRate = 60 * 60 * 1000)
    public void checkPendingTransaction() {

        System.out.println("Checking pending transactions...");

        List<UserToken> tokens = tokenRepository.findAll();

        for (UserToken tn : tokens) {
            Long userId = tn.getUserId();

//            List<Transaction> all = transactionRepository.findByUserId(userId);
//            all.forEach(t -> System.out.println("DB STATUS: " + t.getStatus()));

            List<Transaction> pendingTransactions =
                    transactionRepository.findByUserIdAndStatus(userId, "SYNCED");

            System.out.println("Matched SYNCED count: " + pendingTransactions.size());

            if (!pendingTransactions.isEmpty()) {
                try {
                    sendWebPush(tn.getToken());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

    }

    private void sendWebPush(String token)
            throws FirebaseMessagingException {

        String webLink = "https://pay-offline-qr.vercel.app/dashboard";

        Message message = Message.builder()
                .setToken(token)
                .putData("type", "WEB_PAYMENT")
                .putData("title", "Reminder: Complete Payment")
//                .putData("body", "Click to pay ₹" + txn.getAmount())
                .putData("upiLink", webLink)
                .build();

        FirebaseMessaging.getInstance().send(message);
    }
}

