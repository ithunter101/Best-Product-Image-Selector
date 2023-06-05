import React from 'react';
import ProductList from '@/components/ProductList';
import ProductUploadForm from '@/components/ProductUploadForm';

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="py-4 bg-gray-800 text-white">
                <h1 className="text-2xl font-bold text-center">Product Management</h1>
            </header>

            {/* Content */}
            <main className="flex-1 p-8">
                <div className="container mx-auto">
                    {/* Product List */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Product List</h2>
                        <ProductList />
                    </div>

                    {/* Product Upload Form */}
                    <div>
                        <ProductUploadForm />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;