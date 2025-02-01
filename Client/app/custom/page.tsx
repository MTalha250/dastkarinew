"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { FaMagic } from 'react-icons/fa';
import ReactLoading from 'react-loading';
import ModelViewer from '@/components/ItemPage/ModelViewer';
import SEO from '@/components/seo';
import toast from 'react-hot-toast';
import useAuthStore from "@/store/authStore";
import { cities } from "@/constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import PhotosUploader from "@/components/checkout/uploader";

interface OrderDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  [key: string]: string; // Index signature for dynamic access
}

const GenerateModel = () => {
  const { user } = useAuthStore();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modelUrl, setModelUrl] = useState('');
  const [status, setStatus] = useState('');
  const [modelError, setModelError] = useState(false);
  const [rawModelUrl, setRawModelUrl] = useState('');
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [images, setImages] = useState<string[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    country: '',
    postalCode: '',
  });

  const downloadAndProxyModel = async (meshyUrl: string) => {
    try {
      const response = await axios.post('/api/proxy-model', {
        modelUrl: meshyUrl
      }, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'model/gltf-binary' });
      const localUrl = URL.createObjectURL(blob);
      return localUrl;
    } catch (error: unknown) {
      console.error('Error downloading model:', error);
      throw new Error('Failed to download model');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrderSubmit = async () => {
    if (!modelUrl) {
      toast.error('Please generate a model first');
      return;
    }

    if (paymentMethod === 'bank' && images.length === 0) {
      toast.error('Please upload the transaction receipt');
      return;
    }

    // Validate all fields
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'country', 'postalCode'];
    const missingFields = requiredFields.filter(field => !orderDetails[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/custom-order`, {
        ...orderDetails,
        modelUrl: rawModelUrl,
        prompt,
        paymentMethod,
        paymentReceipt: images[0] || '',
        total: 5000, // Set your price
        delivery: orderDetails.city === 'Lahore' ? 0 : 300,
      });

      toast.success('Custom order placed successfully!');
      // Reset form
      setModelUrl('');
      setRawModelUrl('');
      setPrompt('');
      setImages([]);
      setPaymentMethod('cod');
      if (!user) {
        setOrderDetails({
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          country: '',
          postalCode: '',
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const generateModel = async () => {
    if (!prompt) {
      toast.error('Please enter a description');
      return;
    }

    setLoading(true);
    setProgress(0);
    setStatus('Initializing...');
    setModelUrl('');
    setModelError(false);

    try {
      // Step 1: Generate preview model
      const generateResponse = await axios.post('https://api.meshy.ai/openapi/v2/text-to-3d', {
        mode: 'preview',
        prompt: prompt,
        negative_prompt: 'low quality, low resolution, low poly, ugly',
        art_style: 'realistic',
        should_remesh: true,
      }, {
        headers: {
          'Authorization': 'Bearer msy_cE2FqT5X8optXtN2OpMiQCZd4TBjc2YFTe7l'
        }
      });

      const taskId = generateResponse.data.result;
      setStatus('Generating your masterpiece...');

      // Step 2: Monitor progress
      while (true) {
        const statusResponse = await axios.get(
          `https://api.meshy.ai/openapi/v2/text-to-3d/${taskId}`,
          {
            headers: {
              'Authorization': 'Bearer msy_cE2FqT5X8optXtN2OpMiQCZd4TBjc2YFTe7l'
            }
          }
        );

        const taskStatus = statusResponse.data;
        setProgress(taskStatus.progress || 0);

        if (taskStatus.status === 'SUCCEEDED') {
          setStatus('Downloading model...');
          try {
            const localUrl = await downloadAndProxyModel(taskStatus.model_urls.glb);
            setModelUrl(localUrl);
            setRawModelUrl(taskStatus.model_urls.glb);
            setStatus('Complete');
            toast.success('3D model generated successfully!');
          } catch (downloadError) {
            throw new Error('Failed to download the model');
          }
          break;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error:any) {
      console.error('Error generating model:', error);
      setModelError(true);
      toast.error(error.message || 'Failed to generate 3D model. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (modelUrl && modelUrl.startsWith('blob:')) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [modelUrl]);

  return (
    <div className="pt-32 pb-10 min-h-screen bg-[#FFFFF1]">
      <SEO
        title="Sculpt Your Dreams | AI-Powered 3D Artistry"
        description="Transform your imagination into breathtaking 3D masterpieces. Our AI-powered atelier brings your artistic vision to life with stunning detail and precision."
      />

      <div className="px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair text-[#2C1810] mb-6">
              Sculpt Your Dreams
            </h1>
            <p className="text-[#3C2815]/80 leading-relaxed max-w-2xl mx-auto font-light">
              Welcome to our digital atelier, where imagination takes form. Through the harmonious 
              blend of artificial intelligence and artistic vision, watch as your words transform 
              into breathtaking three-dimensional masterpieces. Each creation is a unique journey 
              from concept to reality.
            </p>
          </div>

          <div className="bg-white border border-[#DEB887]/30 p-8 md:p-12 mb-12">
            <div className="flex flex-col space-y-6">
              <div>
                <label className="block font-playfair text-[#2C1810] mb-3">
                  Paint Your Vision with Words:
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Envision your masterpiece... Perhaps an ethereal crystal palace floating among clouds, or a mythical creature born from stardust..."
                  className="w-full h-32 p-4 border border-[#DEB887]/30 focus:border-[#DEB887] outline-none transition-colors bg-transparent text-[#3C2815] placeholder:text-[#3C2815]/50 font-light"
                  disabled={loading}
                />
              </div>

              <button
                onClick={generateModel}
                disabled={loading}
                className="bg-[#2C1810] text-[#E8DED1] px-8 py-4 font-playfair hover:bg-[#3C2815] transition-colors relative group flex items-center justify-center gap-3"
              >
                <div className="absolute inset-0 border border-[#DEB887] opacity-30"></div>
                <div className="absolute inset-[1px] border border-[#DEB887] opacity-20"></div>
                {loading ? (
                  <>
                    <ReactLoading type="spin" height={20} width={20} color="#E8DED1" />
                    <span>Crafting Your Vision ({progress}%)</span>
                  </>
                ) : (
                  <>
                    <FaMagic className="text-[#DEB887]" />
                    <span>Breathe Life Into Your Vision</span>
                  </>
                )}
              </button>

              {loading && (
                <div className="text-center">
                  <p className="font-playfair text-[#3C2815]/70 mb-2 italic">{status}</p>
                  <div className="w-full bg-[#DEB887]/10 h-2">
                    <div 
                      className="h-full bg-[#DEB887] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {modelUrl && !modelError && (
            <>
              <div className="bg-white border border-[#DEB887]/30 p-8 md:p-12 mb-12">
                <h2 className="text-2xl font-playfair text-[#2C1810] mb-6">Your Masterpiece Awaits</h2>
                <ModelViewer modelUrl={modelUrl} />
              </div>

              <div className="bg-white border border-[#DEB887]/30 p-8 md:p-12">
                <h2 className="text-2xl font-playfair text-[#2C1810] mb-6">Order Your Creation</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-playfair text-[#2C1810] mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={orderDetails.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#DEB887]/30 focus:border-[#DEB887] outline-none"
                        disabled={!!user}
                      />
                    </div>
                    <div>
                      <label className="block font-playfair text-[#2C1810] mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={orderDetails.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#DEB887]/30 focus:border-[#DEB887] outline-none"
                        disabled={!!user}
                      />
                    </div>
                    <div>
                      <label className="block font-playfair text-[#2C1810] mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={orderDetails.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#DEB887]/30 focus:border-[#DEB887] outline-none"
                        disabled={!!user}
                      />
                    </div>
                    <div>
                      <label className="block font-playfair text-[#2C1810] mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={orderDetails.address}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#DEB887]/30 focus:border-[#DEB887] outline-none"
                        disabled={!!user}
                      />
                    </div>
                    <div>
                      <label className="block font-playfair text-[#2C1810] mb-2">City</label>
                      <select
                        name="city"
                        value={orderDetails.city}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#DEB887]/30 focus:border-[#DEB887] outline-none"
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-playfair text-[#2C1810] mb-2">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={orderDetails.country}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#DEB887]/30 focus:border-[#DEB887] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-playfair text-[#2C1810] mb-2">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={orderDetails.postalCode}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#DEB887]/30 focus:border-[#DEB887] outline-none"
                      />
                    </div>
                  </div>

                  <div className="border-t border-[#DEB887]/30 pt-6">
                    <h3 className="font-playfair text-[#2C1810] mb-4">Payment Method</h3>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 mb-4">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank">Bank Transfer</Label>
                      </div>
                      {paymentMethod === "bank" && (
                        <div className="mb-6 p-4 border border-[#DEB887]/30">
                          <p className="text-sm text-[#3C2815]/80 mb-4">
                            Please transfer PKR 5,000 to:<br />
                            Account Title: <span className="font-semibold">Hafiz Muhammad Umair</span><br />
                            Account Number: <span className="font-semibold">0304 4105720</span><br />
                            Bank: <span className="font-semibold">Easypaisa</span>
                          </p>
                          <PhotosUploader
                            maxPhotos={1}
                            addedPhotos={images}
                            onChange={(photos: string[]) => setImages(photos)}
                          />
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod">Cash on Delivery</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="border-t border-[#DEB887]/30 pt-6">
                    <div className="flex justify-between mb-2">
                      <span className="font-playfair text-[#2C1810]">Model Price</span>
                      <span className="font-playfair text-[#2C1810]">PKR 5,000</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-playfair text-[#2C1810]">Delivery</span>
                      <span className="font-playfair text-[#2C1810]">
                        {orderDetails.city === 'Lahore' ? 'Free' : 'PKR 300'}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="font-playfair text-[#2C1810]">Total</span>
                      <span className="font-playfair text-[#2C1810]">
                        PKR {orderDetails.city === 'Lahore' ? '5,000' : '5,300'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleOrderSubmit}
                    className="w-full bg-[#2C1810] text-[#E8DED1] px-8 py-4 font-playfair hover:bg-[#3C2815] transition-colors relative group"
                  >
                    <div className="absolute inset-0 border border-[#DEB887] opacity-30"></div>
                    <div className="absolute inset-[1px] border border-[#DEB887] opacity-20"></div>
                    Place Order
                  </button>
                </div>
              </div>
            </>
          )}

          {modelError && (
            <div className="bg-white border border-red-300 p-8 md:p-12 text-center">
              <p className="text-red-600 font-light">A moment of artistic pause... Please try bringing your vision to life again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateModel; 