import React, { useState, Fragment, useEffect, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';

// --- Helper Functions and Constants ---

// Function to format currency (Vietnamese Dong)
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0 VNĐ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Dummy PostHog tracking function (replace with actual PostHog client in a real app)
const posthog = {
  capture: (eventName, properties = {}) => {
    console.log(`[PostHog] Event Captured: ${eventName}`, properties);
    // In a real application, you would call window.posthog.capture(eventName, properties);
  },
};

// --- SlideOverCart Component ---

/**
 * SlideOverCart component displays a shopping cart as a slide-over panel from the right.
 * It allows users to view, adjust quantities, remove items, and initiate VietQR payment.
 */
const SlideOverCart = ({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onInitiateVietQR,
}) => {
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [error, setError] = useState(null);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  // Handle quantity update
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(itemId);
      return;
    }
    setLoadingItemId(itemId);
    setError(null);
    try {
      await onUpdateQuantity(itemId, newQuantity);
      posthog.capture('cart_item_quantity_updated', { itemId, newQuantity });
    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError('Cập nhật số lượng thất bại. Vui lòng thử lại.');
    } finally {
      setLoadingItemId(null);
    }
  };

  // Handle item removal
  const handleRemoveItem = async (itemId) => {
    setLoadingItemId(itemId); // Use this for a generic loading state during removal
    setError(null);
    try {
      await onRemoveItem(itemId);
      posthog.capture('cart_item_removed', { itemId });
    } catch (err) {
      console.error('Failed to remove item:', err);
      setError('Xóa sản phẩm thất bại. Vui lòng thử lại.');
    } finally {
      setLoadingItemId(null);
    }
  };

  // Handle VietQR payment initiation
  const handleInitiateVietQR = async () => {
    setIsInitiatingPayment(true);
    setError(null);
    try {
      // Assuming onInitiateVietQR returns { qrCodeUrl, orderId }
      const paymentResult = await onInitiateVietQR(totalAmount);
      console.log('VietQR payment initiated:', paymentResult);
      posthog.capture('vietqr_payment_initiated', { totalAmount, orderId: paymentResult?.orderId });
      // You might want to display the QR code or redirect user here
      // For now, just logging
    } catch (err) {
      console.error('Failed to initiate VietQR payment:', err);
      setError('Khởi tạo thanh toán VietQR thất bại. Vui lòng thử lại.');
    } finally {
      setIsInitiatingPayment(false);
    }
  };

  // Basic styling for the component
  const styles = {
    panel: {
      width: '100%',
      maxWidth: '400px', // Max width for desktop
      height: '100%',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      right: 0,
      top: 0,
      zIndex: 50, // Higher than most content
    },
    header: {
      padding: '16px 24px',
      borderBottom: '1px solid #e2e8f0', // Equivalent to border-b-gray-200
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f8fafc', // Light background for header
    },
    title: {
      fontSize: '1.25rem', // text-xl
      fontWeight: '600', // font-semibold
      color: '#1a202c', // text-gray-900
    },
    closeButton: {
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.5rem',
      color: '#4a5568', // text-gray-600
      lineHeight: '1',
    },
    cartItemsContainer: {
      flexGrow: 1,
      overflowY: 'auto',
      padding: '24px',
      backgroundColor: '#ffffff',
    },
    emptyCartMessage: {
      textAlign: 'center',
      padding: '40px 0',
      color: '#718096', // text-gray-500
      fontSize: '1rem',
    },
    cartItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '20px',
      borderBottom: '1px solid #edf2f7', // border-b-gray-100
    },
    itemImage: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginRight: '16px',
    },
    itemDetails: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    itemName: {
      fontWeight: '500', // font-medium
      fontSize: '1rem',
      color: '#1a202c', // text-gray-900
      marginBottom: '4px',
    },
    itemPrice: {
      fontSize: '0.9rem',
      color: '#4a5568', // text-gray-600
      marginBottom: '8px',
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
    },
    qtyButton: {
      width: '28px',
      height: '28px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid #cbd5e0', // border-gray-300
      backgroundColor: '#f7fafc', // bg-gray-50
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1rem',
      color: '#4a5568',
      transition: 'background-color 0.2s',
    },
    qtyInput: {
      width: '40px',
      textAlign: 'center',
      border: '1px solid #cbd5e0',
      borderRadius: '4px',
      margin: '0 8px',
      padding: '4px 0',
      fontSize: '0.9rem',
      color: '#1a202c',
    },
    removeItemButton: {
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem', // text-sm
      color: '#e53e3e', // text-red-600
      marginLeft: '16px',
      '&:hover': {
        textDecoration: 'underline',
      },
      display: 'flex',
      alignItems: 'center',
      padding: '4px 8px',
      borderRadius: '4px',
      transition: 'background-color 0.2s',
    },
    footer: {
      padding: '24px',
      borderTop: '1px solid #e2e8f0', // border-t-gray-200
      backgroundColor: '#f8fafc', // Light background for footer
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    totalLabel: {
      fontSize: '1.125rem', // text-lg
      fontWeight: '600', // font-semibold
      color: '#1a202c',
    },
    totalAmount: {
      fontSize: '1.25rem', // text-xl
      fontWeight: '700', // font-bold
      color: '#2d3748', // text-gray-800
    },
    vietQRButton: {
      width: '100%',
      padding: '12px 24px',
      backgroundColor: '#28a745', // Green for success/payment
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.125rem', // text-lg
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingSpinner: {
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid #fff',
      borderRadius: '50%',
      width: '16px',
      height: '16px',
      animation: 'spin 1s linear infinite',
      marginLeft: '8px',
    },
    errorBox: {
      backgroundColor: '#fef2f2', // bg-red-50
      color: '#dc2626', // text-red-700
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
      border: '1px solid #fca5a5', // border-red-300
    },
    '@keyframes spin': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
  };

  // Add a style tag for keyframe animations and responsive media query if using CSS-in-JS without a lib
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      /* Responsive adjustments */
      @media (max-width: 768px) {
        .slide-over-cart-panel {
          max-width: 100% !important; /* Full width on smaller screens */
        }
      }
      .qty-button:hover {
        background-color: #e2e8f0;
      }
      .remove-item-button:hover {
        background-color: #fee2e2;
      }
      .vietqr-button:hover {
        background-color: #218838;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);


  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', transitionProperty: 'opacity', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDuration: '500ms' }} />
        </Transition.Child>

        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, display: 'flex', justifyContent: 'flex-end' }}>
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel style={styles.panel} className="slide-over-cart-panel">
                  <div style={styles.header}>
                    <Dialog.Title style={styles.title}>
                      Giỏ hàng
                    </Dialog.Title>
                    <button
                      type="button"
                      style={styles.closeButton}
                      onClick={onClose}
                      aria-label="Đóng giỏ hàng"
                    >
                      &times; {/* Times symbol for close */}
                    </button>
                  </div>

                  <div style={styles.cartItemsContainer}>
                    {error && (
                      <div style={styles.errorBox}>
                        <p>{error}</p>
                      </div>
                    )}
                    {cartItems.length === 0 ? (
                      <p style={styles.emptyCartMessage}>Giỏ hàng của bạn đang trống.</p>
                    ) : (
                      <div>
                        {cartItems.map((item) => (
                          <div key={item.id} style={styles.cartItem}>
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              style={styles.itemImage}
                            />
                            <div style={styles.itemDetails}>
                              <h3 style={styles.itemName}>{item.name}</h3>
                              <p style={styles.itemPrice}>Giá: {formatCurrency(item.price)}</p>
                              <div style={styles.quantityControls}>
                                <button
                                  type="button"
                                  style={styles.qtyButton}
                                  className="qty-button"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={loadingItemId === item.id || item.quantity <= 1}
                                  aria-label={`Giảm số lượng của ${item.name}`}
                                >
                                  -
                                </button>
                                <input
                                  type="text" // Use text to avoid number spin buttons
                                  value={loadingItemId === item.id ? '...' : item.quantity}
                                  style={styles.qtyInput}
                                  readOnly // Make it read-only for simplicity, quantity changed by buttons
                                  aria-label={`Số lượng hiện tại của ${item.name}`}
                                />
                                <button
                                  type="button"
                                  style={styles.qtyButton}
                                  className="qty-button"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  disabled={loadingItemId === item.id}
                                  aria-label={`Tăng số lượng của ${item.name}`}
                                >
                                  +
                                </button>
                                <button
                                  type="button"
                                  style={styles.removeItemButton}
                                  className="remove-item-button"
                                  onClick={() => handleRemoveItem(item.id)}
                                  disabled={loadingItemId === item.id}
                                  aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                                >
                                  {loadingItemId === item.id ? (
                                    <div style={styles.loadingSpinner} />
                                  ) : (
                                    'Xóa'
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {cartItems.length > 0 && (
                    <div style={styles.footer}>
                      <div style={styles.totalRow}>
                        <span style={styles.totalLabel}>Tổng tiền:</span>
                        <span style={styles.totalAmount}>{formatCurrency(totalAmount)}</span>
                      </div>
                      <button
                        type="button"
                        style={styles.vietQRButton}
                        className="vietqr-button"
                        onClick={handleInitiateVietQR}
                        disabled={isInitiatingPayment || totalAmount <= 0}
                        aria-label="Thanh toán bằng VietQR"
                      >
                        {isInitiatingPayment ? (
                          <>
                            Đang xử lý...
                            <div style={styles.loadingSpinner} />
                          </>
                        ) : (
                          'Thanh toán VietQR'
                        )}
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SlideOverCart;
