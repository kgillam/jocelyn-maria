import React, { useState } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, Check, ArrowLeft, Upload, X, ImageIcon } from 'lucide-react';
import { parsePrice, formatPrice } from '../data/products';
import { useProducts } from '../context/ProductContext';
import { useCart, PurchaseOption } from '../context/CartContext';
import { processReferenceImage, ProcessedImage } from '../utils/image';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addItem } = useCart();
  const { getProductById, visibleProducts, loading } = useProducts();

  const product = getProductById(id ?? '');

  // Honor a ?size= param (e.g. from the homepage quick-order card) when valid.
  const requestedSize = searchParams.get('size') ?? undefined;
  const defaultSize =
    product?.sizes?.find(s => s.label === requestedSize)?.label ?? product?.sizes?.[0]?.label;

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | undefined>(defaultSize);
  const [option, setOption] = useState<PurchaseOption>('original');
  const [printCount, setPrintCount] = useState(1);
  const [reference, setReference] = useState<ProcessedImage | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  if (loading) {
    return <main className="min-h-screen bg-cream pt-32 pb-24 flex items-center justify-center"><div className="w-8 h-8 border-2 border-olive border-t-transparent rounded-full animate-spin"></div></main>;
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-cream pt-32 pb-24 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-serif text-3xl text-ink mb-4 uppercase tracking-[0.15em] font-light">Piece Not Found</h1>
          <div className="w-16 h-px bg-olive mx-auto mb-8"></div>
          <p className="font-sans text-ink/70 mb-8">We couldn't find the piece you were looking for.</p>
          <Link to="/shop" className="inline-flex items-center text-sm font-serif uppercase tracking-widest text-olive hover:text-ink transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const isCustom = product.category === 'Custom' || product.type === 'Custom';
  // A reference photo is required for made-to-order (custom) pieces.
  const needsReference = isCustom;
  const canAddToCart = !needsReference || reference !== null;

  // The original's price follows the selected size when the product is sized.
  const selectedSize = product.sizes?.find(s => s.label === size);
  const basePrice = selectedSize ? selectedSize.price : parsePrice(product.price);
  // Prints are offered ONLY when an explicit per-size or per-product print price
  // exists. There is no sitewide fallback, so a card or original painting never
  // charges a phantom print fee the admin never set.
  const printUnit = selectedSize?.printPrice ?? product.printPrice;
  const offersPrints = printUnit != null;
  const displayedTotal =
    basePrice + (offersPrints && option === 'original-prints' ? (printUnit ?? 0) * printCount : 0);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image file.');
      return;
    }
    setUploadError('');
    setIsProcessing(true);
    try {
      const processed = await processReferenceImage(file);
      setReference(processed);
    } catch {
      setUploadError('Sorry, that image could not be processed. Please try another.');
    } finally {
      setIsProcessing(false);
      e.target.value = ''; // allow re-selecting the same file
    }
  };

  const addConfiguredItem = () => {
    addItem({
      product,
      option,
      printQuantity: option === 'original-prints' ? printCount : 0,
      size,
      basePrice: formatPrice(basePrice),
      printPrice: printUnit,
      referenceImageName: reference?.name,
      referenceImagePreview: reference?.dataUrl
    });
  };

  const handleAdd = () => {
    if (!canAddToCart) return;
    addConfiguredItem();
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (!canAddToCart) return;
    addConfiguredItem();
    navigate('/cart');
  };

  const handlePrev = () =>
    setActiveImage(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
  const handleNext = () =>
    setActiveImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1));

  const related = visibleProducts.filter(p => p.id !== product.id).slice(0, 2);

  const optionButtonClass = (selected: boolean) =>
    `w-full text-left p-4 border transition-colors ${
      selected ? 'border-olive bg-olive/5' : 'border-sage/40 hover:border-sage/70'
    }`;

  return (
    <main className="min-h-screen bg-cream pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-10">
          <Link to="/shop" className="inline-flex items-center text-xs font-sans uppercase tracking-widest text-ink/60 hover:text-olive transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-20">

          {/* Left: Image Gallery (sticks to top while scrolling the details) */}
          <div className="w-full lg:w-7/12 lg:sticky lg:top-32 lg:self-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-ivory/60">
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={activeImage}
                  src={product.images[activeImage]}
                  alt={`${product.title} ${activeImage + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-lg"
                />
              </AnimatePresence>

              {product.images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-3">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous image"
                    className="bg-white/80 hover:bg-white text-ink rounded-full p-2 shadow-sm transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next image"
                    className="bg-white/80 hover:bg-white text-ink rounded-full p-2 shadow-sm transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 sm:grid-cols-6 gap-3">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`relative aspect-square overflow-hidden rounded-sm bg-ivory/60 border transition-colors ${
                      idx === activeImage ? 'border-olive' : 'border-transparent hover:border-sage/40'
                    }`}
                  >
                    <img src={image} alt="" className="absolute inset-0 w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-5/12 flex flex-col">
            <p className="text-[11px] font-sans text-ink/50 uppercase tracking-widest mb-3">{product.type || product.category}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-ink mb-4 font-light">{product.title}</h1>
            <p className="font-sans text-2xl text-ink/90 mb-6">{formatPrice(basePrice)}</p>

            <div className="w-16 h-px bg-olive mb-6"></div>

            <p className="font-sans text-ink/70 leading-relaxed mb-8 whitespace-pre-line">{product.description}</p>

            {product.details && (
              <ul className="space-y-2 mb-8">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start font-sans text-sm text-ink/70">
                    <Check className="w-4 h-4 text-olive mr-3 mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <p className="font-serif text-sm tracking-widest uppercase text-ink/80 mb-3">Size</p>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(s => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setSize(s.label)}
                      className={`px-5 py-2.5 border font-sans text-sm transition-colors ${
                        size === s.label ? 'border-olive bg-olive/5 text-ink' : 'border-sage/40 text-ink/70 hover:border-sage/70'
                      }`}
                    >
                      {s.label} — {formatPrice(s.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase option selector — shown only when this piece is sold as prints */}
            {offersPrints && (
            <div className="mb-8">
              <p className="font-serif text-sm tracking-widest uppercase text-ink/80 mb-3">Choose Your Order</p>
              <div className="space-y-3">
                <button type="button" onClick={() => setOption('original')} className={optionButtonClass(option === 'original')}>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base text-ink">Original Piece Only</span>
                    <span className="font-sans text-sm text-ink/80">{formatPrice(basePrice)}</span>
                  </div>
                  <p className="font-sans text-xs text-ink/50 mt-1">One original, hand-finished piece.</p>
                </button>

                <button type="button" onClick={() => setOption('original-prints')} className={optionButtonClass(option === 'original-prints')}>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base text-ink">Original + Prints</span>
                    <span className="font-sans text-sm text-ink/80">{formatPrice(basePrice)} + {formatPrice(printUnit ?? 0)}/print</span>
                  </div>
                  <p className="font-sans text-xs text-ink/50 mt-1">The original piece plus additional prints to share.</p>

                  {option === 'original-prints' && (
                    <div
                      className="mt-4 flex items-center justify-between"
                      onClick={e => e.stopPropagation()}
                    >
                      <span className="font-sans text-sm text-ink/70">Number of prints</span>
                      <div className="flex items-center border border-sage/40 bg-cream">
                        <button
                          type="button"
                          onClick={() => setPrintCount(c => Math.max(1, c - 1))}
                          aria-label="Fewer prints"
                          className="px-2.5 py-2 text-ink hover:text-olive transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-sans text-ink select-none">{printCount}</span>
                        <button
                          type="button"
                          onClick={() => setPrintCount(c => c + 1)}
                          aria-label="More prints"
                          className="px-2.5 py-2 text-ink hover:text-olive transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </div>
            )}

            {/* Reference photo upload (required for custom pieces) */}
            {needsReference && (
              <div className="mb-8">
                <p className="font-serif text-sm tracking-widest uppercase text-ink/80 mb-1">
                  Reference Photo <span className="text-olive">*</span>
                </p>
                <p className="font-sans text-xs text-ink/50 mb-3">
                  Upload the photo you'd like Jocelyn to paint from. Required to add this piece to your cart.
                </p>

                {reference ? (
                  <div className="flex items-center gap-4 p-3 border border-olive bg-olive/5">
                    <img src={reference.dataUrl} alt="Reference preview" className="w-16 h-16 object-cover rounded-sm flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm text-ink truncate">{reference.name}</p>
                      <p className="font-sans text-xs text-olive">Reference attached</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReference(null)}
                      aria-label="Remove reference photo"
                      className="text-ink/40 hover:text-ink transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed border-sage/40 hover:border-olive py-8 bg-ivory hover:bg-olive/5 transition-all text-center rounded-sm">
                    {isProcessing ? (
                      <span className="font-sans text-sm text-ink/60">Processing image…</span>
                    ) : (
                      <>
                        <Upload className="w-7 h-7 text-olive mb-2 opacity-80" />
                        <span className="font-sans text-sm text-ink/60 group-hover:text-ink/80 transition-colors px-4">
                          Click to upload your reference photo
                        </span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                  </label>
                )}

                {uploadError && <p className="font-sans text-xs text-red-600 mt-2">{uploadError}</p>}
              </div>
            )}

            {/* Running total */}
            <div className="flex items-center justify-between border-t border-sage/20 pt-5 mb-5">
              <span className="font-serif text-sm tracking-widest uppercase text-ink/70">Total</span>
              <span className="font-serif text-2xl text-ink">{formatPrice(displayedTotal)}</span>
            </div>

            {/* Add to Cart / Buy Now */}
            <button
              onClick={handleAdd}
              disabled={!canAddToCart}
              className="w-full bg-ink text-cream py-4 font-serif uppercase tracking-[0.15em] text-sm hover:bg-olive transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ink"
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!canAddToCart}
              className="mt-3 w-full border border-ink text-ink py-4 font-serif uppercase tracking-[0.15em] text-sm hover:bg-ink hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-ink"
            >
              Buy Now
            </button>

            {needsReference && !canAddToCart && (
              <p className="font-sans text-xs text-ink/50 mt-3 flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5" /> Upload a reference photo to continue.
              </p>
            )}

            {isCustom && (
              <div className="mt-6 p-5 bg-ivory border border-sage/30 text-sm font-sans text-ink/70 leading-relaxed">
                This is a made-to-order commission. After checkout, Jocelyn will review your reference photo and reach
                out with any questions. Prefer to discuss first?{' '}
                <Link to="/custom-commissions" className="text-olive underline hover:text-ink transition-colors">
                  Start a commission inquiry
                </Link>.
              </div>
            )}
          </div>
        </div>

        {/* Related / You may also like */}
        {related.length > 0 && (
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="font-serif text-2xl md:text-3xl text-ink uppercase tracking-[0.1em] font-light">You May Also Like</h2>
              <div className="w-16 h-px bg-olive mx-auto mt-4"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-3xl mx-auto">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
