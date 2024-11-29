/* "use client";
import React from 'react';
import { useDispatch } from 'react-redux';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { setPaymentSuccess, setPaymentError } from '@/redux/slices/paypalSlice';
import { updateReservationStatus } from '@/redux/slices/reservationsSlice';  
import { status } from '@/interfaces/interfaces'; 

interface PayPalButtonProps {
  reservIdentification: string;  
  onSuccess: (orderId: string) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ reservIdentification, onSuccess }) => {
  const dispatch = useDispatch();
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const amount = 5; 

  if (!clientId) {
    console.error('PayPal client ID is missing');
    return null;
  }

  return (
    <PayPalScriptProvider options={{ clientId, currency: 'USD' }}>
      <PayPalButtons
        createOrder={async () => {
          try {
            const response = await fetch(`http://localhost:3000/paypal/create-order/${reservIdentification}?currency=USD`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            const orderData = await response.json();
            if (!response.ok) {
              throw new Error(orderData.message || 'Error creating order');
            }

            return orderData.id;
          } catch (error) {
            console.error('Error creating order:', error);
            dispatch(setPaymentError('Error creating PayPal order'));
            return '';
          }
        }}
        onApprove={async (data) => {
          try {
            const { orderID, payerID } = data;

            if (!payerID || typeof payerID !== 'string') {
              throw new Error('Invalid payer ID');
            }

            const captureResponse = await fetch(`http://localhost:3000/paypal/return?token=${orderID}&PayerID=${payerID}&paymentUuid=${reservIdentification}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            const captureData = await captureResponse.json();
            if (!captureResponse.ok) {
              throw new Error(captureData.message || 'Error capturing order');
            }

            dispatch(setPaymentSuccess(orderID));

            dispatch(updateReservationStatus({ reservIdentification, status: status.active }));

            onSuccess(orderID);
          } catch (error) {
            console.error('Error capturing order:', error);
            dispatch(setPaymentError('Error capturing PayPal order'));
          }
        }}
        onError={(err) => {
          console.error('PayPal Buttons error:', err);
          dispatch(setPaymentError('Error with PayPal payment'));
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
 */"use client";
import React from 'react';
import { useDispatch } from 'react-redux';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { setPaymentSuccess, setPaymentError } from '@/redux/slices/paypalSlice';
import { updateReservationStatus } from '@/redux/slices/reservationsSlice';  
import { status } from '@/interfaces/interfaces'; 

interface PayPalButtonProps {
  reservIdentification: string;  
  onSuccess: (orderId: string) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ reservIdentification, onSuccess }) => {
  const dispatch = useDispatch();
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  
  const amount = 5;  // Puedes modificar el monto a lo que necesites

  if (!clientId) {
    console.error('PayPal client ID is missing');
    return null;
  }

  console.log('PayPal client ID:', clientId);

  return (
    <PayPalScriptProvider options={{ clientId, currency: 'USD' }}>
      <PayPalButtons
        createOrder={async () => {
          console.log('Creating order for reservation:', reservIdentification);
          try {
            const response = await fetch(`http://localhost:3000/paypal/create-order/${reservIdentification}?currency=USD&amount=${amount}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            console.log('Response from create-order:', response);

            // Verificar que la respuesta sea de tipo JSON
            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
              const text = await response.text();
              console.error('Expected JSON response but got:', text);
              throw new Error('Error creating order: Expected JSON response');
            }

            // Si la respuesta es JSON, proceder a leerla
            const orderData = await response.json();
            console.log('Order data:', orderData);
            return orderData.id;
          } catch (error) {
            console.error('Error creating order:', error);
            dispatch(setPaymentError('Error creating PayPal order'));
            return '';
          }
        }}
        onApprove={async (data) => {
          console.log('Order approved, data:', data);

          try {
            const { orderID, payerID } = data;

            if (!payerID || typeof payerID !== 'string') {
              console.error('Invalid payerID:', payerID);
              throw new Error('Invalid payer ID');
            }

            console.log('Approving order with orderID:', orderID, 'payerID:', payerID);

            const captureResponse = await fetch(`http://localhost:3000/paypal/return?token=${orderID}&PayerID=${payerID}&paymentUuid=${reservIdentification}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            console.log('Response from capture order:', captureResponse);

            if (captureResponse.ok) {
              const captureData = await captureResponse.json();
              console.log('Capture data:', captureData);
              dispatch(setPaymentSuccess(orderID));
              dispatch(updateReservationStatus({ reservIdentification, status: status.active }));
              onSuccess(orderID);
            } else {
              const text = await captureResponse.text();
              console.error('Failed to capture order:', text);
              throw new Error('Error capturing order');
            }
          } catch (error) {
            console.error('Error capturing order:', error);
            dispatch(setPaymentError('Error capturing PayPal order'));
          }
        }}
        onError={(err) => {
          console.error('PayPal Buttons error:', err);
          dispatch(setPaymentError('Error with PayPal payment'));
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
