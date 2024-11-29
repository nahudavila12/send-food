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
 */
"use client";
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
  
  const amount = 5.0;  // Puedes modificar el monto a lo que necesites

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

            if (!orderData.approveLink || !orderData.orderId) {
              console.error('No approve link or orderId returned');
              throw new Error('Error: Expected approve link and orderId');
            }

            console.log('Order created successfully, approve link:', orderData.approveLink);

            // Despachar éxito con orderId y approveLink
            dispatch(setPaymentSuccess({
              orderId: orderData.orderId,
              approveLink: orderData.approveLink
            }));

            return orderData.approveLink;  // Aquí devolvemos el enlace de aprobación
          } catch (error) {
            console.error('Error creating order:', error);
            dispatch(setPaymentError('Error creating PayPal order'));
            return '';  // En caso de error, devolver una cadena vacía
          }
        }}
        onApprove={async (data) => {  // Cambiar a una función asíncrona
          console.log('Order approved, data:', data);

          try {
            // Redirigir al usuario a PayPal para completar el pago
            const orderId = data.orderID;  // Obtener el orderId de la respuesta
            if (orderId) {
              // Usamos el orderId para verificar el pago en el backend
              const verifyPaymentResponse = await fetch(`http://localhost:3000/paypal/return?token=${data.token}&PayerID=${data.payerID}&paymentUuid=${orderId}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              const paymentVerification = await verifyPaymentResponse.json();
              if (paymentVerification.success) {
                // El pago ha sido verificado correctamente
                dispatch(updateReservationStatus({ reservIdentification: reservIdentification, status: status.active }));
                onSuccess(orderId); // Llamar a onSuccess con el orderId
              } else {
                console.error('Payment verification failed');
                dispatch(setPaymentError('Payment verification failed'));
              }
            } else {
              console.error('No orderId returned in onApprove');
              dispatch(setPaymentError('Error: No orderId available'));
            }
          } catch (error) {
            console.error('Error in onApprove:', error);
            dispatch(setPaymentError('Error handling PayPal approval'));
          }
        }}
        onError={(err) => {
          console.error('PayPal Buttons error:', err);
          // Verificar el error de tipo INVALID_RESOURCE_ID
          if (err.message.includes('INVALID_RESOURCE_ID')) {
            console.error('Error: Invalid resource ID - Ensure the approveLink is valid.');
            dispatch(setPaymentError('Error: Invalid resource ID - Ensure the approveLink is valid.'));
          } else {
            dispatch(setPaymentError('Error with PayPal payment'));
          }
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
