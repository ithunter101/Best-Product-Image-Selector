import React, {useEffect, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import ReactPaginate from 'react-paginate';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/20/solid'

const basUrl = process.env.NEXT_PUBLIC_BASE_URL

interface IProductImage {
    id: number
    url: string
    score: number
}

interface IProduct {
    id: number
    keywords: string
    image_count: number
    images: IProductImage[]
}

const ProductList = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(0)
    const itemsPerPage = 8;
    const [loading, setLoading] = useState<boolean>(false)
    const [products, setProducts] = useState<IProduct[]>([])
    const [bestProductImageIndexes, setBestProductImageIndexes] = useState([])

    useEffect(() => {
        setLoading(true);

        fetch(`${basUrl}/api/products/?page=${currentPage}`)
            .then(response => response.json())
            .then(data => {
                setCount(data?.count ?? 0);
                setProducts(data?.results ?? []);
                setLoading(false);
            })
            .catch(
                error => {
                    console.log(error);
                    setLoading(false);
                }
            );
    }, [currentPage])

    useEffect(() => {
        let _bestProductImageIndexes = [];
        products.forEach((product, product_index) => {
            let score = 0;
            _bestProductImageIndexes.push(-1);

            product.images.forEach((image, image_index) => {
                if (score < image.score) {
                    score = image.score;
                    _bestProductImageIndexes[product_index] = image_index;
                }
            })
        });
        console.log("here", _bestProductImageIndexes);
        setBestProductImageIndexes(_bestProductImageIndexes);
    }, [products])

    const handlePageChange = (selected: any) => {
        setCurrentPage(selected.selected+1);
    };

    const openModal = (product: IProduct) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setShowModal(false);
    };

    return (
        <div>

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="text-white">Loading...</div>
                </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product, product_index) => (
                    <div key={product.id} className="border border-gray-200 rounded p-4">
                        <h2 className="text-lg font-bold mb-2">{product.keywords}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {product.images.map((image, image_index) => (
                                <div
                                    key={image.id}
                                    id={`product-image-${image.id}`}
                                    className="bg-gray-400 rounded animate-pulse p-0"
                                >
                                    <LazyLoadImage
                                        src={image.url}
                                        alt="Product Image"
                                        className="h-full w-full cursor-pointer rounded transition-opacity m-0"
                                        style={{border: image_index == bestProductImageIndexes[product_index] ? "3px solid red" : ""}}
                                        onClick={() => openModal(product)}
                                        effect="opacity"
                                        afterLoad={() => {
                                            const element = document.getElementById(`product-image-${image.id}`);
                                            if (element) {
                                                element.classList.remove('animate-pulse');
                                                element.style.opacity = '1';
                                            }
                                        }}
                                        wrapperClassName="h-full w-full"
                                        onError={(e) => {
                                            // e.currentTarget.style.display = 'none';
                                            e.currentTarget.src = '/placeholder255x255.png';

                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {/*<ReactPaginate*/}
            {/*    pageCount={Math.ceil(count / itemsPerPage)}*/}
            {/*    marginPagesDisplayed={2}*/}
            {/*    pageRangeDisplayed={5}*/}
            {/*    onPageChange={handlePageChange}*/}
            {/*    containerClassName="flex justify-center mt-4"*/}
            {/*    activeClassName="bg-gray-200"*/}
            {/*    previousClassName="mr-2 px-3 py-2 cursor-pointer hover:bg-gray-200 rounded"*/}
            {/*    nextClassName="ml-2 px-3 py-2 cursor-pointer hover:bg-gray-200 rounded"*/}
            {/*    breakClassName="px-3 py-2 cursor-pointer hover:bg-gray-200 rounded"*/}
            {/*    pageLinkClassName="px-3 py-2 cursor-pointer hover:bg-gray-200 rounded"*/}
            {/*    previousLabel={<ChevronLeftIcon className="h-5 w-5" />}*/}
            {/*    nextLabel={<ChevronRightIcon className="h-5 w-5" />}*/}
            {/*    breakLabel={'...'}*/}
            {/*/>*/}
            <div>
                <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <a
                            href="#"
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Previous
                        </a>
                        <a
                            href="#"
                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Next
                        </a>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        {count>0 && <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{currentPage*itemsPerPage-(itemsPerPage-1)}</span> to <span className="font-medium">
                                {currentPage*itemsPerPage}
                            </span> of{' '}
                                    <span className="font-medium">{count}</span> results
                                </p>
                            </div>}
                        <div>
                            <ReactPaginate
                                    pageCount={Math.ceil(count / itemsPerPage)}

                                initialPage={currentPage-1}
                                onPageChange={handlePageChange}
                                containerClassName="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                activeClassName="bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                pageClassName="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                breakClassName="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                                previousClassName="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                nextClassName="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                breakLabel={'...'}
                                previousLabel={<ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />}
                                nextLabel={<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Transition.Root show={showModal} as={React.Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={closeModal}
                >
                    <div className="flex items-center justify-center min-h-screen py-5 px-4 bg-gray-900 bg-opacity-50">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0"/>
                        </Transition.Child>

                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="relative max-w-5xl w-full bg-white rounded-lg p-4 overflow-y-auto">
                                <Dialog.Title className="text-lg font-bold text-center mb-4">
                                    Product Images - {selectedProduct?.keywords}
                                </Dialog.Title>

                                <div className="max-h-192 overflow-y-auto">
                                    <div className="grid grid-cols-3 gap-4">
                                        {selectedProduct?.images.map((image) => (
                                            <div
                                                key={image.id}
                                                id={`product-model-image-${image.id}`}
                                                className="h-250 w-250 bg-gray-400 rounded animate-pulse p-0"
                                            >
                                                <LazyLoadImage
                                                    src={image.url}
                                                    alt="Product Image"
                                                    className="h-full w-full cursor-pointer rounded transition-opacity"
                                                    effect="opacity"
                                                    afterLoad={() => {
                                                        const element = document.getElementById(`product-model-image-${image.id}`);
                                                        if (element) {
                                                            element.classList.remove('animate-pulse');
                                                            element.style.opacity = '1';
                                                        }
                                                    }}
                                                    wrapperClassName="h-full w-full"
                                                    onError={(e) => {
                                                        // e.currentTarget.style.display = 'none';

                                                        e.currentTarget.src = '/placeholder255x255.png';
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

export default ProductList;
