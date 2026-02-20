package payment.system.dto;

import java.util.List;

public class TransactionWrapper {

    private List<TransactionDTO> transactions;

    // getters and setters
    public List<TransactionDTO> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<TransactionDTO> transactions) {
        this.transactions = transactions;
    }
}

