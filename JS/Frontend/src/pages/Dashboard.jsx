import { useState, useEffect } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import {
  loadPendingTransactions,
  addTransaction,
  getAllTransactions,
  syncPendingTransactions,
  updateTransaction,
  getPendingTransactions,
} from '../db/indexedDB';
import { useAuth } from '../context/AuthContext';

export const Dashboard = ({ syncing }) => {
  const {user}=useAuth();
  const isOnline = useOnlineStatus();
  const [transactions, setTransactions] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [qrImage, setQrImage] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null);


  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQrImage(file);
      setQrPreview(URL.createObjectURL(file));
    }
  };


  const loadTransactions = async () => {
    const allTransactions = await getAllTransactions();
    setTransactions(allTransactions.sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    ));
  };

  
  useEffect(() => {
    if(isOnline){
      loadPendingTransactions(JSON.parse(user).id);
    }
    loadTransactions();
  }, []);

    useEffect(() => {
    // console.log(JSON.parse(user).id);
    
    loadTransactions();
  }, [syncing]);

  // useEffect(() => {
  //   if (isOnline) {
  //     syncPendingTransactions();
  //   }
  // }, [isOnline]);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!amount || !recipient || !qrImage) {
      alert('Please fill in all fields and upload a QR code');
      return;
    }

    const transaction = {
      amount: parseFloat(amount),
      recipient,
      timestamp: new Date().toISOString(),
      qrImage,
      status : 'PENDING',
      // type: 'PAYMENT',
    };

    await addTransaction(transaction);

    if (isOnline) {
      // console.log(user.id);
      
      await syncPendingTransactions(JSON.parse(user).id);
    } else {
      alert('You are offline. This payment will be synced when you reconnect.');
    }
    await loadTransactions();

    setAmount('');
    setRecipient('');
    setShowPaymentModal(false);
  };

  const getStatusBadge = (status) => {
    if (status === 'SYNCED') {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Synced
        </span>
      );
    }
    if (status === 'PENDING') {
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  }

  if (status === 'SUCCESS') {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          Success
        </span>
      );
    }
 
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalBalance = 5000.00;
  const totalSpent = transactions
    .filter(t => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1 font-large font-style:bold">
            Welcome back, {JSON.parse(user)?.name || 'User'}</p>
        </div>

        <div className="card mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Transactions
            </h2>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="btn-primary"
            >
              Make Payment
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Start by making your first payment
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      QR Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(transaction.timestamp)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.recipient}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        &#8377; {transaction.amount.toFixed(2)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction?.qrImage ? (
                          <button
                            onClick={() =>
                              setSelectedQR(URL.createObjectURL(transaction.qrImage))
                            }
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            View
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">No QR</span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(transaction.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

        {selectedQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 relative max-w-sm w-full">

              {/* Close Button */}
              <button
                onClick={() => setSelectedQR(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>

              <h2 className="text-lg font-semibold mb-4 text-center">
                QR Code
              </h2>

              <img
                src={selectedQR}
                alt="QR Code"
                className="w-full h-auto rounded-lg border"
              />
            </div>
          </div>
        )}


        {!isOnline && (
          <div className="card bg-yellow-50 border-2 border-yellow-200">
            <div className="flex items-start space-x-3">
              <svg
                className="w-6 h-6 text-yellow-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-yellow-800">
                  You are currently offline
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You can still make payments. They will be synced automatically
                  when you're back online.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Make Payment
              </h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter recipient name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Receiver QR Code
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQrUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                />

                {qrPreview && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-1">Preview:</p>
                    <img
                      src={qrPreview}
                      alt="QR Preview"
                      className="w-40 h-40 object-contain border rounded-lg"
                    />
                  </div>
                )}
              </div>


              {!isOnline && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    You're offline. This payment will be processed when you reconnect.
                  </p>
                </div>
              )}

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Send Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
