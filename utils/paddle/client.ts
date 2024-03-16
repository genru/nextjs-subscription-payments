'use client'
import { initializePaddle, Paddle, Environments } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';


export function usePaddle() {
    // Create a local state to store Paddle instance
    const [paddle, setPaddle] = useState<Paddle>();

    // Download and initialize Paddle instance from CDN
    useEffect(() => {
        console.info(process.env['PADDLE_ENVIRONMENT'], process.env.PADDLE_CLIENT_TOKEN)

        if(process.env['PADDLE_ENVIRONMENT']!=='sandbox' && process.env['PADDLE_ENVIRONMENT']!=='production') {
            process.env['PADDLE_ENVIRONMENT'] = 'sandbox'
        }
        if(!process.env['PADDLE_CLIENT_TOKEN']) {
            console.error('Paddle client token is not set');
            process.env['PADDLE_CLIENT_TOKEN']="live_eda73dc49369e61bf27cc1826af"
            return;
        }
      initializePaddle({ environment: process.env['PADDLE_ENVIRONMENT'] as Environments, token: "live_872a2d9629351ac10fd500d96f5" }).then(
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
