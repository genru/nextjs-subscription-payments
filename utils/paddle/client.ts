'use client'
import { initializePaddle, Paddle, Environments } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';


export function usePaddle() {
    // Create a local state to store Paddle instance
    const [paddle, setPaddle] = useState<Paddle>();

    // Download and initialize Paddle instance from CDN
    useEffect(() => {
        console.info(process.env['NEXT_PUBLIC_PADDLE_ENVIRONMENT'], process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN)

        if(process.env['NEXT_PUBLIC_PADDLE_ENVIRONMENT']!=='sandbox' && process.env['NEXT_PUBLIC_PADDLE_ENVIRONMENT']!=='production') {
            process.env['NEXT_PUBLIC_PADDLE_ENVIRONMENT'] = 'sandbox'
        }
        if(!process.env['NEXT_PUBLIC_PADDLE_CLIENT_TOKEN']) {
            console.error('Paddle client token is not set');
            return;
        }
      initializePaddle({ environment: process.env['NEXT_PUBLIC_PADDLE_ENVIRONMENT'] as Environments, token: process.env['NEXT_PUBLIC_PADDLE_CLIENT_TOKEN'], eventCallback: (event) => { console.info(event)} }).then(
        (paddleInstance: Paddle | undefined) => {
            console.info('Paddle instance', paddleInstance)
          if (paddleInstance) {
            setPaddle(paddleInstance);
          }
        }, err => {
            console.error(err);
        }
      );
    }, []);

    return paddle;
  }
