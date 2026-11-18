import React, { memo, useId, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { MAX_EVENT_ITEMS, formatPhoneMask, toE164Brazil } from './lib.js';
import { ProductPhoto } from './ProductPhoto.jsx';
import { QuantityStepper } from './QuantityStepper.jsx';

/* Formulário da bandeja com estado próprio: cada tecla/foco re-renderiza só
   este componente, não a página inteira (cardápio, fotos, senha). */
export const CheckoutForm = memo(function CheckoutForm({
  action,
  titleId,
  initialName,
  initialPhone,
  cartItemsDetailed,
  totalItemsInCart,
  isSubmitting,
  submitError,
  onQuantityChange,
  onClose,
  onSubmit,
}) {
  const nameId = useId();
  const nameErrorId = useId();
  const phoneId = useId();
  const phoneHintId = useId();
  const phoneErrorId = useId();
  const noteId = useId();
  const noteHintId = useId();
  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  const [guestName, setGuestName] = useState(initialName || '');
  const [guestPhone, setGuestPhone] = useState(initialPhone || '');
  const [note, setNote] = useState('');
  const [touched, setTouched] = useState({ name: false, phone: false });
  const [edited, setEdited] = useState({
    name: Boolean(initialName),
    phone: Boolean(initialPhone),
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const trimmedName = guestName.trim();
  const validE164Phone = toE164Brazil(guestPhone);
  const isNameValid = trimmedName.length >= 2;
  const isPhoneValid = Boolean(validE164Phone);
  const isFormValid = isNameValid && isPhoneValid && totalItemsInCart > 0;

  const showNameError = (submitAttempted || (touched.name && edited.name)) && !isNameValid;
  const showPhoneError = (submitAttempted || (touched.phone && edited.phone)) && !isPhoneValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitAttempted(true);
    if (!isNameValid) {
      nameInputRef.current?.focus();
      return;
    }
    if (!isPhoneValid) {
      phoneInputRef.current?.focus();
      return;
    }
    onSubmit({ name: trimmedName, phone: guestPhone, e164: validE164Phone, note: note.trim() });
  };

  return (
        <form
          action={action}
          method="post"
          onSubmit={handleSubmit}
          noValidate
          style={{
            padding: '10px 20px max(24px, env(safe-area-inset-bottom))',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              alignSelf: 'center',
              width: 36,
              height: 5,
              borderRadius: 999,
              background: 'var(--ev-line-strong)',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h2 id={titleId} className="ev-title1" style={{ margin: 0 }}>
                Sua bandeja
              </h2>
              <p className="ev-footnote" style={{ margin: '4px 0 0', fontSize: 14 }}>
                Confira os itens e informe onde devemos avisar quando ficar pronto.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar bandeja"
              className="ev-icon-btn ev-pressable"
            >
              <X size={19} strokeWidth={2.2} />
            </button>
          </div>

          {/* Lista editável da bandeja (sem preços) */}
          <div
            style={{
              background: 'var(--ev-sunken)',
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            {cartItemsDetailed.map((item, idx) => (
              <div key={item.productId}>
                {idx > 0 && (
                  <div style={{ height: 1, marginLeft: 68, background: 'var(--ev-line)' }} />
                )}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      overflow: 'hidden',
                      background: 'var(--ev-line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ProductPhoto src={item.photo} fallbackSize={18} />
                  </div>

                  <div className="ev-body-strong" style={{ flex: 1, minWidth: 0, fontSize: 15 }}>
                    {item.name}
                  </div>

                  <QuantityStepper
                    value={item.quantity}
                    canIncrement={totalItemsInCart < MAX_EVENT_ITEMS}
                    productName={item.name}
                    onChange={(next) => onQuantityChange(item.productId, next)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Campos no estilo exato de `FormField.tsx` (100% genéricos e sem chips) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="ev-field">
              <label htmlFor={nameId} className="ev-field-label">
                Como podemos te chamar?
              </label>
              <input
                ref={nameInputRef}
                id={nameId}
                name="guestName"
                type="text"
                autoFocus
                required
                minLength={2}
                maxLength={60}
                autoComplete="name"
                enterKeyHint="next"
                value={guestName}
                aria-invalid={showNameError ? 'true' : 'false'}
                aria-describedby={showNameError ? nameErrorId : undefined}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  setEdited((prev) => ({ ...prev, name: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                placeholder="Ex.: João"
                className={`ev-input ${showNameError ? 'ev-input--error' : ''}`}
              />
              {showNameError && (
                <p id={nameErrorId} className="ev-field-error">
                  Informe seu nome (pelo menos 2 letras) para identificarmos seu pedido.
                </p>
              )}
            </div>

            <div className="ev-field">
              <label htmlFor={phoneId} className="ev-field-label">
                WhatsApp para avisar quando ficar pronto
              </label>
              <input
                ref={phoneInputRef}
                id={phoneId}
                name="guestPhone"
                type="tel"
                inputMode="numeric"
                required
                autoComplete="tel-national"
                enterKeyHint="next"
                value={guestPhone}
                aria-invalid={showPhoneError ? 'true' : 'false'}
                aria-describedby={showPhoneError ? `${phoneHintId} ${phoneErrorId}` : phoneHintId}
                onChange={(e) => {
                  const { value, selectionStart } = e.target;
                  const onlyDigits = (v) => v.replace(/\D/g, '');
                  let nextDigits = onlyDigits(value);
                  // Backspace em cima de "(", ")", espaço ou "-" (no meio do
                  // número) não remove dígito; apaga o dígito anterior ao cursor.
                  if (
                    value.length < guestPhone.length &&
                    nextDigits === onlyDigits(guestPhone) &&
                    selectionStart != null
                  ) {
                    const digitsBefore = onlyDigits(value.slice(0, selectionStart)).length;
                    if (digitsBefore > 0) {
                      nextDigits =
                        nextDigits.slice(0, digitsBefore - 1) + nextDigits.slice(digitsBefore);
                    }
                  }
                  setGuestPhone(formatPhoneMask(nextDigits));
                  setEdited((prev) => ({ ...prev, phone: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                placeholder="(27) 99999-9999"
                className={`ev-input ev-tabular ${showPhoneError ? 'ev-input--error' : ''}`}
              />
              {showPhoneError ? (
                <p id={phoneErrorId} className="ev-field-error">
                  Digite um WhatsApp válido com DDD. Ex.: (27) 99999-9999.
                </p>
              ) : (
                <p id={phoneHintId} className="ev-field-hint">
                  Enviamos apenas uma mensagem quando seu pedido ficar pronto.
                </p>
              )}
            </div>

            <div className="ev-field">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label htmlFor={noteId} className="ev-field-label">
                  Observação (opcional)
                </label>
                <span id={noteHintId} className="ev-field-hint ev-tabular">
                  {note.length}/120
                </span>
              </div>
              <input
                id={noteId}
                name="note"
                type="text"
                maxLength={120}
                enterKeyHint="done"
                value={note}
                aria-describedby={noteHintId}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex.: sem açúcar, sem cebola..."
                className="ev-input"
              />
            </div>
          </div>

          {submitError && (
            <p role="alert" className="ev-field-error" style={{ margin: 0 }}>
              {submitError}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 2 }}>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="ev-btn ev-btn--primary ev-pressable"
            >
              {isSubmitting ? 'Confirmando…' : 'Confirmar pedido'}
            </button>
            <p className="ev-footnote" style={{ margin: 0, textAlign: 'center' }}>
              Pedido sem cobrança — cortesia do evento.
            </p>
          </div>
        </form>
  );
});
