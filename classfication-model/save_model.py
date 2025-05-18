import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.applications import ResNet152
import os

def create_and_save_model(num_classes=23, save_path='resnet152.h5'):
    """
    Create and save a ResNet152 model with proper optimizer state and metrics.
    
    Args:
        num_classes (int): Number of output classes
        save_path (str): Path to save the model
    """
    # Create base model
    base_model = ResNet152(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    
    # Add custom layers
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(1024, activation='relu')(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    
    # Create model
    model = Model(inputs=base_model.input, outputs=predictions)
    
    # Compile model with optimizer and metrics
    optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
    model.compile(
        optimizer=optimizer,
        loss='categorical_crossentropy',
        metrics=['accuracy', tf.keras.metrics.AUC(), tf.keras.metrics.Precision(), tf.keras.metrics.Recall()]
    )
    
    # Save model with optimizer state
    model.save(save_path, save_format='h5', include_optimizer=True)
    print(f"Model saved successfully to {save_path}")
    
    # Verify the saved model
    try:
        loaded_model = tf.keras.models.load_model(save_path)
        print("Model loaded successfully with optimizer state")
        print(f"Optimizer: {loaded_model.optimizer}")
        print(f"Metrics: {loaded_model.metrics}")
    except Exception as e:
        print(f"Error verifying saved model: {e}")

if __name__ == "__main__":
    create_and_save_model() 