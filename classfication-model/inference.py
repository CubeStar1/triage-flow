import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os

# Load the pre-trained ResNet101 model
try:
    model = load_model('C:\\Users\\pradh\\Downloads\\resnet101.h5')
except Exception as e:
    print(f"Error loading the model: {e}")
    model = None

def inference(img_path, target_size=(224, 224)):
    """
    Performs inference on an image using the loaded ResNet101 model.

    Args:
        img_path (str): Path to the input image file.
        target_size (tuple): The target size (height, width) for resizing the image,
                             consistent with the model's input requirements.
                             For ResNet101, this is typically (224, 224).

    Returns:
        tuple: A tuple containing the predicted class index and the probability
               distribution over all classes. Returns (None, None) if the
               model is not loaded or if there's an error during processing.
    """
    if model is None:
        print("Error: Model not loaded. Please ensure 'resnet101.h5' exists in the correct path.")
        return None, None

    try:
        # Load and preprocess the image
        img = image.load_img(img_path, target_size=target_size)
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        img_array = tf.keras.applications.resnet.preprocess_input(img_array)

        # Perform inference
        predictions = model.predict(img_array)

        # Return the index of the most likely class and the probability distribution
        predicted_class_index = np.argmax(predictions[0])
        probability_distribution = predictions[0]

        return predicted_class_index, probability_distribution

    except Exception as e:
        print(f"Error during inference: {e}")
        return None, None

if __name__ == '__main__':
    # Path to a sample image from your Dermnet dataset
    dermnet_image_path ="C:/Users/pradh/Downloads/07Acne081101.jpg"
    # Replace 'path/to/your/dermnet/image.jpg' with the actual path to an image

    # If you have a list of class names corresponding to the order
    # in which your model was trained, define it here.
    # This is crucial for interpreting the predicted class index.
    class_labels = [
        'acne',
        'actinic keratosis basal cell carcinoma and other malignant lesions',
        'atopic dermatitis photos',
        'bullous disease photos',
        'cellulitis impetigo and other bacterial infections',
        'eczema photos',
        'exanthems and drug eruptions',
        'hair loss photos alopecia and other hair diseases',
        'herpes hpv and other stds photos',
        'light diseases and disorders of pigmentation',
        'lupus and other connective tissue diseases',
        'melanoma skin cancer nevi and moles',
        'nail fungus and other nail disease',
        'poison ivy photos and other contact dermatitis',
        'psoriasis pictures lichen planus and related diseases',
        'scabies lyme disease and other infestations and bites',
        'seborrheic keratoses and other benign tumors',
        'systemic disease',
        'tinea ringworm candidiasis and other fungal infections',
        'urticaria hives',
        'vascular tumors',
        'vasculitis photos',
        'warts mollusca and other viral infections'
    ]

    if not os.path.exists(dermnet_image_path):
        print(f"Error: Image not found at '{dermnet_image_path}'. Please provide a valid path to a Dermnet dataset image.")
    else:
        predicted_class, probabilities = inference(dermnet_image_path)

        if predicted_class is not None:
            print(f"Predicted class index: {predicted_class}")
            print(f"Probability distribution: {probabilities}")

            if class_labels and 0 <= predicted_class < len(class_labels):
                predicted_label = class_labels[predicted_class]
                print(f"Predicted label: {predicted_label}")
            else:
                print("Note: Class labels not provided or predicted index out of range.")