import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { config } from '@/config';

/**
 * Centraliza a inscrição na lista de espera.
 *
 * Antes, essa mesma lógica estava copiada em Hero, DownloadCTA e Footer —
 * três cópias que precisavam ser alteradas juntas a cada mudança.
 *
 * @param {{ successTitle?: string, successDescription?: string }} messages
 */
export function useWaitlist(messages = {}) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    successTitle = 'Pronto, você está na lista',
    successDescription = 'Avisamos assim que o Barrakinha estiver no ar na sua região.',
  } = messages;

  const submit = async (event) => {
    event.preventDefault();

    const value = email.trim();
    if (!value || loading) return;

    setLoading(true);

    try {
      if (config.googleSheetUrl) {
        const response = await fetch(config.googleSheetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: value,
            created_at: new Date().toLocaleString('pt-BR'),
          }),
        });

        if (!response.ok) throw new Error('Falha no envio');
      } else {
        console.warn(
          'Nenhuma URL de planilha configurada em src/config.js. Simulando envio.',
        );
        await new Promise((resolve) => setTimeout(resolve, 700));
      }

      toast({ title: successTitle, description: successDescription });
      setEmail('');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Não deu pra cadastrar seu e-mail',
        description: 'Confira sua conexão e tente de novo.',
      });
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, loading, submit };
}
