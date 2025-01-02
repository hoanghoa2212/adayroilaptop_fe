// ... (Giữ nguyên các import bên trên)
// Chú ý: Đảm bảo bạn import đúng đường dẫn như file gốc

import { Fragment, useState, useEffect } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from "@heroicons/react/20/solid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Pagination from "@mui/material/Pagination";
import { Backdrop, CircularProgress, Slider } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { filters, singleFilter, sortOptions } from "./FilterData";
import LaptopCard from "../LaptopCard/LaptopCard";
import { findLaptops } from "../../../Redux/Admin/Laptop/Action";
import { useBrand, useCpu, useDiskCapacity, useGpu } from "./hooks";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Laptop() {
  // ... (Giữ nguyên toàn bộ logic state, effects, handlers từ dòng 27 đến 145 của file gốc)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const jwt = localStorage.getItem("jwt"); // Biến này không dùng trong code gốc
  const param = useParams();
  const { laptop } = useSelector((store) => store);

  const location = useLocation();
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);

  const handleLoaderClose = () => {
    setIsLoaderOpen(false);
  };

  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);
  const colorValue = searchParams.get("color");
  const sizeValue = searchParams.get("size");
  const price = searchParams.get("price");
  const disccount = searchParams.get("disccout");
  const sortValue = searchParams.get("sort");

  const pageNumber = parseInt(searchParams.get("page") || "1", 10);

  const minRamMemory = parseInt(searchParams.get("minRamMemory")??1) ;
  const maxRamMemory = parseInt(searchParams.get("maxRamMemory")??100) ;
  const stock = searchParams.get("stock");
  const [priceRange, setPriceRange] = useState([0,100000000]);

  const {cpus, cpu}= useCpu(searchParams)
  const {gpus, gpu}= useGpu(searchParams)
  const {diskCapacity} = useDiskCapacity(searchParams)
  const {brands, brand} = useBrand(searchParams)

  const handleSortChange = (value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("sort", value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const handlePaginationChange = (event, value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const [reload, setReload] = useState(true);

  useEffect(() => {
    const [minPrice, maxPrice] = price === null ? [0, 0] : price.split("-").map(Number);
    const data = {
      category: param.lavelThree,
      color: colorValue || [],
      minPrice: minPrice || priceRange[0],
      maxPrice: maxPrice || priceRange[1],
      minRamMemory,
      maxRamMemory,
      diskCapacity,
      minDiscount: disccount || 0,
      sortPrice: sortValue || "increase",

      page: pageNumber,
      size: 10,

      gpuIds: gpu ? [gpu] : [],
      brandId: brand || "",
      cpuId: cpu || "",
      stock: stock,
    };

    dispatch(findLaptops(data));
  }, [param.lavelThree, colorValue, brand, reload, diskCapacity, sizeValue, minRamMemory, gpu, maxRamMemory, cpu, price, disccount, sortValue, pageNumber, stock]);

  const handleChange = (event, newValue) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('price', `${newValue[0]}-${newValue[1]}`);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });

    setPriceRange(newValue);
  };

  const handleFilter = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    let filterValues = searchParams.getAll(sectionId);
    if (filterValues.length > 0 && filterValues[0].split(",").includes(value)) {
      filterValues = filterValues[0]
        .split(",")
        .filter((item) => item !== value);
      if (filterValues.length === 0) {
        searchParams.delete(sectionId);
      }
    } else {
      filterValues.push(value);
    }
    if (filterValues.length > 0)
      searchParams.set(sectionId, filterValues.join(","));
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const handleRadioFilterChange = (e, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(sectionId, e.target.value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  useEffect(() => {
    if (laptop.loading) {
      setIsLoaderOpen(true);
    } else {
      setIsLoaderOpen(false);
    }
  }, [laptop.loading]);

  const laptopList = laptop?.laptops?.content || [];
  const totalPages = laptop?.laptops?.totalPages || 1;

  return (
    <div className="bg-white -z-20 ">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">Bộ lọc</h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* FORM BỘ LỌC CHO MOBILE (Copy y nguyên logic form desktop xuống đây) */}
                  <form className="mt-4 border-t border-gray-200">
                    {/* Render các filter giống desktop nhưng trong Dialog */}
                    {filters.map((section) => (
                      <Disclosure as="div" key={section.id} className="border-t border-gray-200 px-4 py-6">
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">{section.name}</span>
                                <span className="ml-6 flex items-center">
                                  {open ? <MinusIcon className="h-5 w-5" aria-hidden="true" /> : <PlusIcon className="h-5 w-5" aria-hidden="true" />}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {section.options.map((option, optionIdx) => (
                                  <div key={option.value} className="flex items-center">
                                    <input
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      defaultChecked={option.checked}
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      onChange={() => handleFilter(option.value, section.id)}
                                    />
                                    <label htmlFor={`filter-mobile-${section.id}-${optionIdx}`} className="ml-3 min-w-0 flex-1 text-gray-500">
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                    {/* ... (Bạn có thể copy thêm các phần filter khác như Price, CPU, RAM vào đây nếu muốn hiển thị trên mobile) */}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto px-2 md:px-4 lg:px-14">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-6">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
              Sản phẩm
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sắp xếp
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <p
                              onClick={() => handleSortChange(option.query)}
                              className={classNames(
                                option.current ? "font-medium text-gray-900" : "text-gray-500",
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm cursor-pointer"
                              )}
                            >
                              {option.name}
                            </p>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Bộ lọc</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="laptops-heading" className="pb-24 pt-6">
            <h2 id="laptops-heading" className="sr-only">Laptops</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
              {/* Desktop Filters */}
              <form className="hidden lg:block border rounded-md p-5 h-fit sticky top-20 overflow-y-auto max-h-[90vh]">
                 {/* ... (Giữ nguyên code form desktop từ file gốc, chỉ thêm sticky để cuộn theo) ... */}
                 {filters.map((section) => (
                    <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6" >
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                ) : (
                                  <PlusIcon className="h-5 w-5" aria-hidden="true"/>
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-4">
                              {section.options.map((option, optionIdx) => (
                                <div key={option.value} className="flex items-center">
                                  <input
                                    id={`filter-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    defaultChecked={option.checked}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    onChange={() => handleFilter(option.value, section.id)}
                                  />
                                  <label
                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                    className="ml-3 text-sm text-gray-600"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                  {singleFilter.map((section) => (
                    <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon className="h-5 w-5" aria-hidden="true"/>
                                ) : (
                                  <PlusIcon className="h-5 w-5" aria-hidden="true"/>
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <Slider
                              defaultValue={priceRange}
                              onChangeCommitted={handleChange}
                              step={100000}
                              valueLabelFormat={(value) => `${value.toLocaleString()}`}
                              min={0}
                              max={100000000}
                              valueLabelDisplay="auto"
                            />
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                  <Disclosure as="div" className="border-b border-gray-200 py-6">
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Ram
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon className="h-5 w-5" aria-hidden="true"/>
                                ) : (
                                  <PlusIcon className="h-5 w-5" aria-hidden="true"/>
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <Slider
                              defaultValue={[minRamMemory,maxRamMemory]}
                              onChangeCommitted={(e,value)=>{
                                const searchParams = new URLSearchParams(location.search);
                                searchParams.set('minRamMemory', value[0]);
                                searchParams.set('maxRamMemory', value[1]);
                                const query = searchParams.toString();
                                navigate({ search: `?${query}` });
                              }}
                              step={2}
                              valueLabelFormat={(value) => `${value.toLocaleString()}`}
                              min={1}
                              max={100}
                              valueLabelDisplay="auto"
                            />
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as="div" className="border-b border-gray-200 py-6">
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Cpu
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon className="h-5 w-5" aria-hidden="true"/>
                                ) : (
                                  <PlusIcon className="h-5 w-5" aria-hidden="true"/>
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <FormControl>
                              <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                              >
                                {cpus.map((item, itemIdx) => (
                                  <FormControlLabel  value={item.id} control={<Radio />} label={item.model}
                                    onChange={(e) => handleRadioFilterChange(e, 'cpuId')}
                                  />
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as="div" className="border-b border-gray-200 py-6">
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Gpu
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon className="h-5 w-5" aria-hidden="true"/>
                                ) : (
                                  <PlusIcon className="h-5 w-5" aria-hidden="true"/>
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <FormControl>
                              <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                              >
                                {gpus.map((item, itemIdx) => (
                                  <FormControlLabel  value={item.id} control={<Radio />} label={item.model}
                                    onChange={(e) => handleRadioFilterChange(e, 'gpuIds')}
                                  />
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as="div" className="border-b border-gray-200 py-6">
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Ổ đĩa
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon className="h-5 w-5" aria-hidden="true"/>
                                ) : (
                                  <PlusIcon className="h-5 w-5" aria-hidden="true"/>
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <Slider
                              defaultValue={diskCapacity}
                              onChangeCommitted={(e, newValue) => {
                                const searchParams = new URLSearchParams(location.search);
                                searchParams.set('minDiskCapacity', newValue[0]);
                                searchParams.set('maxDiskCapacity', newValue[1]);
                                const query = searchParams.toString();
                                navigate({ search: `?${query}` });
                                setReload(prop=>!prop)
                              }}
                              step={50}
                              valueLabelFormat={(value) => `${value.toLocaleString()}`}
                              min={0}
                              max={3000}
                              valueLabelDisplay="auto"
                            />
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as="div" className="border-b border-gray-200 py-6">
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Brand
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon className="h-5 w-5" aria-hidden="true"/>
                                ) : (
                                  <PlusIcon className="h-5 w-5" aria-hidden="true"/>
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <FormControl>
                              <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                              >
                                {brands.map((item, itemIdx) => (
                                  <FormControlLabel  value={item.id} control={<Radio />} label={item.name}
                                    onChange={(e) => handleRadioFilterChange(e, 'brandId')}
                                  />
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
              </form>

              {/* Product Grid */}
              <div className="lg:col-span-4 w-full">
                {/* --- RESPONSIVE UPDATE: Grid 2 cột trên mobile, 3 trên tablet, 4-5 trên desktop --- */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 bg-white py-5 rounded-md">
                  {laptopList.map((item) => (
                    item.status === 1 && <LaptopCard key={item.id} laptop={item} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        <section className="w-full px-4 lg:px-[3.6rem] mb-10">
          <div className="mx-auto px-4 py-5 flex justify-center shadow-lg border rounded-md">
            <Pagination
              count={totalPages}
              page={pageNumber}
              color="primary"
              onChange={handlePaginationChange}
            />
          </div>
        </section>

        <section>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoaderOpen}
            onClick={handleLoaderClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </section>
      </div>
    </div>
  );
}