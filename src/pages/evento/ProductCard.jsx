import React, { memo } from 'react';
import { Plus } from 'lucide-react';
import { ProductPhoto } from './ProductPhoto.jsx';
import { QuantityStepper } from './QuantityStepper.jsx';

/* Cartão do produto isolado e memoizado: mexer em um item (ou digitar na
   bandeja) não re-renderiza o cardápio inteiro. */
export const ProductCard = memo(function ProductCard({
  product,
  qty,
  canAddMore,
  isStoreOpen,
  onQuantityChange,
}) {
  const soldOut = product.available === false;
  return (
                            <article className="ev-product-card">
                              <div className="ev-product-info">
                                <div>
                                  <h3
                                    className="ev-body-strong"
                                    style={{
                                      margin: 0,
                                      color: soldOut ? 'var(--ev-ink-soft)' : 'var(--ev-ink)',
                                    }}
                                  >
                                    {product.name}
                                  </h3>
                                  {product.description && (
                                    <p className="ev-footnote ev-product-desc">
                                      {product.description}
                                    </p>
                                  )}
                                </div>

                                {soldOut && (
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span
                                      className="ev-footnote"
                                      style={{ fontWeight: 600, color: 'var(--ev-danger)' }}
                                    >
                                      Esgotado
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="ev-product-thumb-wrap">
                                <div className="ev-product-thumb">
                                  <ProductPhoto src={product.photo} dim={soldOut} />
                                </div>

                                {!soldOut &&
                                  (qty > 0 && isStoreOpen ? (
                                    <QuantityStepper
                                      floating
                                      value={qty}
                                      canIncrement={canAddMore}
                                      productName={product.name}
                                      onChange={(next) => onQuantityChange(product.id, next)}
                                    />
                                  ) : (
                                    <button
                                      type="button"
                                      disabled={!isStoreOpen}
                                      onClick={() => onQuantityChange(product.id, 1)}
                                      aria-label={
                                        isStoreOpen
                                          ? `Adicionar ${product.name}`
                                          : `${product.name}: barraca fechada`
                                      }
                                      className="ev-add-fab ev-pressable"
                                      style={
                                        !isStoreOpen
                                          ? { background: 'var(--ev-line)', color: 'var(--ev-ink-faint)' }
                                          : undefined
                                      }
                                    >
                                      <Plus size={18} strokeWidth={2.6} />
                                    </button>
                                  ))}
                              </div>
                            </article>
  );
});
