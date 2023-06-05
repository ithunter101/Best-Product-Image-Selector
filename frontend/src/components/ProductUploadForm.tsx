import React, {useState} from 'react';
const basUrl = process.env.NEXT_PUBLIC_BASE_URL

function ProductUploadForm() {
    const [dragging, setDragging] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState<string|null>(null);

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(false);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(false);

        const file = event.dataTransfer.files[0];
        setSelectedFile(file);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files;
        if (file) {
            setSelectedFile(file[0]);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Handle file upload
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            setLoading(true);
            setUploadSuccess(false);
            setUploadError(null);

            fetch(`${basUrl}/api/upload/`, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    setLoading(false);
                    setUploadSuccess(true);
                    setUploadError(null);
                    setSelectedFile(null); // Clear the file input
                    console.log(data);

                })
                .catch(error => {
                    setLoading(false);
                    setUploadSuccess(false);
                    setUploadError("Error occurred while uploading the file.");
                    console.log(error);
                });
        }
    };

    return (
        <div>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                    <div className="text-white">Uploading...</div>
                </div>
            )}
            <h2 className="text-xl font-semibold mb-4">Upload Product Data</h2>
            {uploadSuccess && (
                <div className="text-green-500 mb-4">
                    File uploaded successfully.
                </div>
            )}
            {uploadError && (
                <div className="text-red-500 mb-4">{uploadError}</div>
            )}
            <div
                className={`w-full h-40 border-2 border-dashed rounded-lg p-4 ${
                    dragging ? 'border-blue-400' : 'border-gray-400'
                }`}
                onDragEnter={(e) => handleDragEnter(e)}
                onDragLeave={(e) => handleDragLeave(e)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e)}
            >
                {selectedFile ? (
                    <p className="text-gray-600">{selectedFile.name}</p>
                ) : (
                    <p className="text-gray-600">
                        Drag and drop a file here, or click to select a file.
                    </p>
                )}
            </div>
            <form className="mt-4" onSubmit={(e) => handleSubmit(e)}>
                <input
                    type="file"
                    onChange={(e) => handleFileChange(e)}
                    className="hidden"
                    id="file-input"
                />
                <label
                    htmlFor="file-input"
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
                >
                    Select File
                </label>
                {selectedFile && (
                    <button
                        type="submit"
                        className="inline-block ml-4 px-4 py-2 bg-green-500 text-white rounded-lg"
                    >
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                )}
            </form>
        </div>
    );
}

export default ProductUploadForm;

