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
      modelUrl,
      prompt,
      paymentMethod,
      paymentReceipt: images[0] || '',
      total: 5000, // Set your price
      delivery: orderDetails.city === 'Lahore' ? 0 : 300,
    });

    toast.success('Custom order placed successfully!');
    // Reset form
    setModelUrl('');
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
          setStatus('Complete');
          toast.success('3D model generated successfully!');
        } catch (downloadError) {
          throw new Error('Failed to download the model');
        }
        break;
      } else if (taskStatus.status === 'FAILED') {
        throw new Error('Model generation failed');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error: any) {
    console.error('Error generating model:', error);
    setModelError(true);
    toast.error(error.message || 'Failed to generate 3D model. Please try again.');
  } finally {
    setLoading(false);
  }
};

React.useEffect(() => {
  // Add any necessary side effects here
}, []); 