import React from 'react';

const PetmaPlugin: React.FC = () => {
  const [formState, setFormState] = React.useState<TFormState>({
    username: '',
    name: '',
    description: '',
    'dark-mode': false,
    'image-style': 'noImage',
  });

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { id, value } = event.target;
    setFormState({ ...formState, [id]: value });
  }

  function handleDarkModeToggle(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;
    setFormState({ ...formState, 'dark-mode': checked });
  }

  function handleImageStyleChange(imageStyle: TFormState['image-style']) {
    setFormState({ ...formState, 'image-style': imageStyle });
  }

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    parent.postMessage({ pluginMessage: { type: 'petma', formState } }, '*');
  };

  return (
    <div className="m-4 space-y-4">
      <h1 className="text-2xl font-bold">Petma plugin</h1>

      <div className="space-y-1">
        {/* Username Input */}
        <div>
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            id="username"
            value={formState.username}
            onChange={handleInputChange}
            placeholder="Type here"
            className="input input-bordered input-sm w-full"
          />
        </div>

        {/* Name Input */}
        <div>
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            id="name"
            value={formState.name}
            onChange={handleInputChange}
            placeholder="Type here"
            className="input input-bordered input-sm w-full"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            id="description"
            value={formState.description}
            onChange={handleInputChange}
            placeholder="Type here"
            className="textarea textarea-bordered textarea-sm w-full"
            rows={2}
          />
        </div>
      </div>

      <div className="form-control">
        <label className="cursor-pointer label">
          <span className="label-text">DarkMode</span>
          <input
            type="checkbox"
            id="dark-mode"
            checked={formState['dark-mode']}
            onChange={handleDarkModeToggle}
            className="toggle toggle-sm"
          />
        </label>
      </div>

      {/* Image Style Input */}
      <div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">No Image</span>
            <input
              id="radio-no-image"
              type="radio"
              className="radio radio-sm checked:bg-red-500"
              onChange={() => handleImageStyleChange('noImage')}
              checked={formState['image-style'] === 'noImage'}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Single Image</span>
            <input
              id="radio-single-image"
              type="radio"
              className="radio radio-sm checked:bg-blue-500"
              onChange={() => handleImageStyleChange('singleImage')}
              checked={formState['image-style'] === 'singleImage'}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Carousel</span>
            <input
              name="radio-carousel"
              type="radio"
              className="radio radio-sm checked:bg-yellow-500"
              onChange={() => handleImageStyleChange('carousel')}
              checked={formState['image-style'] === 'carousel'}
            />
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button onClick={handleSubmit} className="btn btn-primary">
        Submit
      </button>
    </div>
  );
};

export default PetmaPlugin;

type TFormState = {
  username: string;
  name: string;
  description: string;
  'dark-mode': boolean;
  'image-style': 'noImage' | 'singleImage' | 'carousel';
};
