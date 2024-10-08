import { useEffect, useState } from 'react';
import {  fetchProduct, Product } from '../../api';  // Import the fetchProductSales function
import ProductModal from '../ProductModal';  // Import the modal component

const SalesTable = () => {
  const [salesData, setSalesData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };
  useEffect(() => {
    const getSalesData = async () => {
      try {
        const data = await fetchProduct();
        setSalesData(data);  // Set the fetched sales data
      } catch (err) {
        setError('Failed to fetch sales data');
      } finally {
        setLoading(false);
      }
    };

    getSalesData();
  }, []);

  if (loading) return <p>Loading sales data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="rounded-sm border justify-between border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Product Sales
      </h4>

      <div className="flex flex-col justify-between">
        <div className="grid grid-cols-3 justify-between  rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Product
            </h5>
          </div>

          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Total Sales
            </h5>
          </div>
        </div>

        {salesData
          .map((sale, key) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-5 ${
                key === salesData.length - 1
                  ? ''
                  : 'border-b border-stroke dark:border-strokedark'
              }`}
              key={sale.product}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <div className="flex-shrink-0">
                </div>
                <p className="hidden text-black dark:text-white sm:block">
                  {sale.product}
                </p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-meta-3">
                  ${Math.round(sale.total_sales * 100 + Number.EPSILON) / 100}
                </p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <button
                  className="text-primary"
                  onClick={() => handleProductClick(sale)}
                >
                  View Details
                </button>
              </div>

            </div>
          ))}
          
        </div>
        {showModal && selectedProduct && (
        <ProductModal
          product={selectedProduct.product}
          totalSales={selectedProduct.total_sales}
          category={selectedProduct.category}
          quantity={selectedProduct.quantity}
          onClose={handleCloseModal}
        />
      )}
    </div>
    
  );
};

export default SalesTable;
