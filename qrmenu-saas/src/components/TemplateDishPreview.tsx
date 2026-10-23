import React from 'react'
import { MenuTemplate } from '../data/templates'
import { useCurrency } from '../data/currency'
import { Sparkles, Clock, Flame, Heart, Check, Plus } from 'lucide-react'

interface TemplateDishPreviewProps {
  template: MenuTemplate;
  compact?: boolean;
}

export default function TemplateDishPreview({ template, compact = false }: TemplateDishPreviewProps) {
  const { formatPrice } = useCurrency()

  const sampleDishes = [
    {
      id: 'd1',
      index: '01',
      name: 'Smoked Truffle Wagyu Ribeye (A5)',
      desc: 'Charcoal-seared A5 Japanese Wagyu, 48-hr bone marrow jus, shaved Périgord black truffle, roasted king trumpet mushroom.',
      price: 480,
      calories: '740 kcal',
      prep: '22 min',
      badge: 'Chef Signature',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'd2',
      index: '02',
      name: 'Pugliese Burrata & Roasted Adriatic Fig',
      desc: 'Imported Puglia burrata, lavender honey roasted figs, 25-yr Modena balsamic glaze, Sicilian pistachio crunch.',
      price: 240,
      calories: '420 kcal',
      prep: '10 min',
      badge: 'Artisanal',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'd3',
      index: '03',
      name: 'Saffron & Maine Lobster Tagliolini',
      desc: 'Handmade squid-ink strands, sweet poached Maine lobster claw, Oscietra royal caviar velvet, Meyer lemon emulsion.',
      price: 390,
      calories: '580 kcal',
      prep: '18 min',
      badge: 'Popular',
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
    },
  ]

  const displayedDishes = compact ? sampleDishes.slice(0, 2) : sampleDishes

  // Dynamic layout rendering based on template.layoutModel
  return (
    <div
      style={{
        backgroundColor: template.backgroundColor,
        color: template.textColor,
        fontFamily: template.fontBody,
        padding: compact ? '16px' : '24px',
        borderRadius: '16px',
        border: `1px solid ${template.borderColor}`,
        boxShadow: template.shadowStyle,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header Banner showcasing Template Model & Typography */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '14px',
        borderBottom: `1px solid ${template.borderColor}`,
      }}>
        <div>
          <div style={{
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            color: template.primaryColor,
            fontWeight: 700,
            marginBottom: 2,
            fontFamily: template.fontHeading,
          }}>
            {template.layoutModel.replace('-', ' ').toUpperCase()} MODEL
          </div>
          <h3 style={{
            fontFamily: template.fontHeading,
            color: template.textColor,
            fontSize: compact ? '1.2rem' : '1.45rem',
            margin: 0,
            fontWeight: 800,
          }}>
            {template.name}
          </h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: template.mutedColor }}>
            Font Pairing: <strong style={{ color: template.primaryColor }}>{template.fontHeading}</strong> (Headings) + <strong>{template.fontBody}</strong> (Body)
          </p>
        </div>

        <div style={{
          padding: '6px 12px',
          borderRadius: template.borderRadius,
          background: `${template.primaryColor}18`,
          border: `1px solid ${template.primaryColor}50`,
          color: template.primaryColor,
          fontSize: '0.75rem',
          fontWeight: 700,
          fontFamily: template.fontHeading,
        }}>
          {template.vibe}
        </div>
      </div>

      {/* MODEL 1: MINIMAL COMPACT (Dotted Leader Lines) */}
      {template.layoutModel === 'minimal-compact' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {displayedDishes.map(dish => (
            <div
              key={dish.id}
              style={{
                padding: '12px 16px',
                background: template.cardBackground,
                borderRadius: template.borderRadius,
                border: `${template.borderWidth} solid ${template.borderColor}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{
                  fontFamily: template.fontHeading,
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: template.textColor,
                  whiteSpace: 'nowrap',
                }}>
                  {dish.name}
                </span>
                <span style={{
                  flex: 1,
                  borderBottom: `1px dotted ${template.mutedColor}`,
                  margin: '0 8px',
                  opacity: 0.6,
                }} />
                <span style={{
                  fontWeight: 800,
                  color: template.primaryColor,
                  fontFamily: template.fontHeading,
                  fontSize: '1.05rem',
                }}>
                  {formatPrice(dish.price)}
                </span>
              </div>
              <p style={{
                margin: '4px 0 0',
                fontSize: '0.78rem',
                color: template.mutedColor,
                lineHeight: 1.4,
              }}>
                {dish.desc}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* MODEL 2: EDITORIAL MAGAZINE (Large Imagery & Story Typography) */}
      {template.layoutModel === 'editorial-magazine' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {displayedDishes.map((dish, i) => (
            <div
              key={dish.id}
              style={{
                background: template.cardBackground,
                borderRadius: template.borderRadius,
                border: `${template.borderWidth} solid ${template.borderColor}`,
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: i === 0 ? '1fr' : '100px 1fr',
                gap: i === 0 ? 0 : '16px',
                alignItems: 'center',
              }}
            >
              <div style={{ position: 'relative', height: i === 0 ? 150 : 100, overflow: 'hidden' }}>
                <img
                  src={dish.image}
                  alt={dish.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  fontFamily: template.fontHeading,
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '2px 8px',
                  borderRadius: 4,
                }}>
                  {dish.index}
                </span>
              </div>
              <div style={{ padding: i === 0 ? '16px' : '8px 16px 8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{
                    fontFamily: template.fontHeading,
                    fontSize: i === 0 ? '1.15rem' : '0.98rem',
                    fontWeight: 800,
                    margin: '0 0 6px',
                    color: template.textColor,
                  }}>
                    {dish.name}
                  </h4>
                  <span style={{
                    fontWeight: 800,
                    color: template.primaryColor,
                    fontSize: '1.1rem',
                    fontFamily: template.fontHeading,
                  }}>
                    {formatPrice(dish.price)}
                  </span>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '0.8rem',
                  color: template.mutedColor,
                  lineHeight: 1.45,
                  fontStyle: 'italic',
                }}>
                  "{dish.desc}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODEL 3: BENTO GRID (Modular Glass Boxes with Micro-Stats) */}
      {template.layoutModel === 'bento-grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : 'repeat(2, 1fr)', gap: '14px' }}>
          {displayedDishes.map((dish, idx) => (
            <div
              key={dish.id}
              style={{
                gridColumn: idx === 0 && !compact ? 'span 2' : 'span 1',
                background: template.cardBackground,
                borderRadius: template.borderRadius,
                border: `${template.borderWidth} solid ${template.borderColor}`,
                padding: '16px',
                display: 'flex',
                gap: '14px',
                alignItems: 'center',
                boxShadow: template.shadowStyle,
              }}
            >
              <img
                src={dish.image}
                alt={dish.name}
                style={{
                  width: idx === 0 && !compact ? 84 : 64,
                  height: idx === 0 && !compact ? 84 : 64,
                  borderRadius: '12px',
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <h4 style={{
                    fontFamily: template.fontHeading,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    margin: 0,
                    color: template.textColor,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {dish.name}
                  </h4>
                  <span style={{
                    color: template.primaryColor,
                    fontWeight: 800,
                    fontSize: '1rem',
                    marginLeft: 8,
                    fontFamily: template.fontHeading,
                  }}>
                    {formatPrice(dish.price)}
                  </span>
                </div>
                <p style={{
                  margin: '0 0 8px',
                  fontSize: '0.75rem',
                  color: template.mutedColor,
                  lineHeight: 1.35,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {dish.desc}
                </p>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', color: template.mutedColor }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Flame size={12} color={template.primaryColor} /> {dish.calories}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Clock size={12} color={template.primaryColor} /> {dish.prep}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODEL 4: CYBERPUNK NEON (HUD Scanlines & Glowing Terminal Badges) */}
      {template.layoutModel === 'cyberpunk-neon' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {displayedDishes.map(dish => (
            <div
              key={dish.id}
              style={{
                background: template.cardBackground,
                borderRadius: template.borderRadius,
                border: `1.5px solid ${template.primaryColor}`,
                padding: '14px',
                position: 'relative',
                boxShadow: `0 0 15px ${template.primaryColor}40`,
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: template.primaryColor,
                color: '#000000',
                fontSize: '0.65rem',
                fontWeight: 900,
                padding: '1px 8px',
                fontFamily: template.fontHeading,
                textTransform: 'uppercase',
              }}>
                [SYS_ID: {dish.index}]
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
                <h4 style={{
                  fontFamily: template.fontHeading,
                  fontSize: '1.02rem',
                  fontWeight: 700,
                  margin: 0,
                  color: template.textColor,
                  letterSpacing: '0.5px',
                }}>
                  &gt; {dish.name}
                </h4>
                <span style={{
                  fontFamily: template.fontHeading,
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: template.primaryColor,
                  textShadow: `0 0 8px ${template.primaryColor}`,
                }}>
                  {formatPrice(dish.price)}
                </span>
              </div>
              <p style={{
                margin: '6px 0 0',
                fontSize: '0.78rem',
                color: template.mutedColor,
                lineHeight: 1.4,
              }}>
                {dish.desc}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* MODEL 5: RETRO POP DINER (3D Drop Shadows & Bold Badge Stamps) */}
      {template.layoutModel === 'retro-pop-diner' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {displayedDishes.map(dish => (
            <div
              key={dish.id}
              style={{
                background: template.cardBackground,
                borderRadius: template.borderRadius,
                border: `${template.borderWidth} solid ${template.borderColor}`,
                padding: '16px',
                boxShadow: template.shadowStyle,
                display: 'flex',
                gap: '14px',
                alignItems: 'center',
              }}
            >
              <img
                src={dish.image}
                alt={dish.name}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '12px',
                  objectFit: 'cover',
                  border: `2px solid ${template.borderColor}`,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{
                    fontFamily: template.fontHeading,
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    margin: 0,
                    color: template.textColor,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {dish.name}
                  </h4>
                  <span style={{
                    background: template.primaryColor,
                    color: '#000000',
                    fontFamily: template.fontHeading,
                    fontSize: '1rem',
                    fontWeight: 900,
                    padding: '3px 10px',
                    borderRadius: '8px',
                    border: '1.5px solid #000000',
                  }}>
                    {formatPrice(dish.price)}
                  </span>
                </div>
                <p style={{
                  margin: '4px 0 0',
                  fontSize: '0.78rem',
                  color: template.mutedColor,
                  lineHeight: 1.35,
                }}>
                  {dish.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODEL 6: CHALKBOARD RUSTIC (Dashed Sketch Borders & Handwritten Notes) */}
      {template.layoutModel === 'chalkboard-rustic' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {displayedDishes.map(dish => (
            <div
              key={dish.id}
              style={{
                background: template.cardBackground,
                borderRadius: template.borderRadius,
                border: `1.5px dashed ${template.borderColor}`,
                padding: '14px 16px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h4 style={{
                  fontFamily: template.fontHeading,
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  margin: 0,
                  color: template.primaryColor,
                }}>
                  ~ {dish.name} ~
                </h4>
                <span style={{
                  fontFamily: template.fontHeading,
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                }}>
                  {formatPrice(dish.price)}
                </span>
              </div>
              <p style={{
                margin: '4px 0 0',
                fontSize: '0.82rem',
                color: template.mutedColor,
                lineHeight: 1.4,
              }}>
                {dish.desc}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* MODEL 7: ALL OTHER STYLES (LUXURY EMBOSSED, BOTANICAL, TOKYO ZEN, PARISIAN BISTRO, MODERN) */}
      {['luxury-embossed', 'botanical-organic', 'tokyo-zen', 'bistro-parisian', 'modern-card'].includes(template.layoutModel) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {displayedDishes.map(dish => (
            <div
              key={dish.id}
              style={{
                background: template.cardBackground,
                borderRadius: template.borderRadius,
                border: `${template.borderWidth} solid ${template.borderColor}`,
                padding: '14px 16px',
                boxShadow: template.shadowStyle,
                display: 'flex',
                gap: '14px',
                alignItems: 'center',
              }}
            >
              <img
                src={dish.image}
                alt={dish.name}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: template.borderRadius,
                  objectFit: 'cover',
                  border: `1px solid ${template.borderColor}`,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{
                    fontFamily: template.fontHeading,
                    fontSize: '1rem',
                    fontWeight: 700,
                    margin: 0,
                    color: template.textColor,
                  }}>
                    {dish.name}
                  </h4>
                  <span style={{
                    color: template.primaryColor,
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    fontFamily: template.fontHeading,
                    marginLeft: 8,
                  }}>
                    {formatPrice(dish.price)}
                  </span>
                </div>
                <p style={{
                  margin: '4px 0 0',
                  fontSize: '0.78rem',
                  color: template.mutedColor,
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {dish.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Action Footer */}
      <div style={{
        marginTop: '18px',
        paddingTop: '12px',
        borderTop: `1px solid ${template.borderColor}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.75rem',
        color: template.mutedColor,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={13} color={template.primaryColor} />
          <span>Interactive Preview • Real-time Typography & Layout</span>
        </div>
        <span style={{
          color: template.primaryColor,
          fontWeight: 700,
          fontFamily: template.fontHeading,
        }}>
          {template.badgeStyle.toUpperCase()} BADGES
        </span>
      </div>
    </div>
  )
}
