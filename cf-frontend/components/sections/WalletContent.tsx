"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addFunds,
  setSelectedPaymentMethod,
  selectWalletBalance,
  selectWalletTransactions,
  selectWalletPayments,
  selectSelectedPaymentMethod,
} from "@/store/slices/walletSlice";
import type { WalletTransaction, PaymentRecord } from "@/store/slices/walletSlice";
import ProfileSidebar from "./ProfileSidebar";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

type TabType = "add" | "history" | "payments";
type PaymentMethodType = "visa" | "mastercard" | "jazzcash";
type SortField = "id" | "amount" | "action" | "date";
type SortDirection = "asc" | "desc" | null;

const ENTRIES_OPTIONS = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
];

const MONTH_OPTIONS = [
  { value: "", label: "Chose The Month" },
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function getYearOptions() {
  const currentYear = new Date().getFullYear();
  const options = [{ value: "", label: "Chose The Year" }];
  for (let i = currentYear; i <= currentYear + 10; i++) {
    options.push({ value: String(i), label: String(i) });
  }
  return options;
}

const YEAR_OPTIONS = getYearOptions();

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SortIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="inline-block ml-1 opacity-50"
    >
      <path d="M7 15l5 5 5-5" />
      <path d="M7 9l5-5 5 5" />
    </svg>
  );
}

interface HistoryTableProps {
  data: WalletTransaction[] | PaymentRecord[];
  type: "wallet" | "payment";
}

function HistoryTable({ data, type }: HistoryTableProps) {
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
      );
      if (sortDirection === "desc") setSortField(null);
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  const filtered = data.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const amount = String(item.amount);
    const date = formatDate(item.date).toLowerCase();
    const action =
      type === "wallet"
        ? (item as WalletTransaction).type
        : (item as PaymentRecord).status;
    return (
      amount.includes(query) ||
      date.includes(query) ||
      action.toLowerCase().includes(query)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;
    let aVal: string | number = "";
    let bVal: string | number = "";
    switch (sortField) {
      case "amount":
        aVal = a.amount;
        bVal = b.amount;
        break;
      case "date":
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
        break;
      case "action":
        aVal =
          type === "wallet"
            ? (a as WalletTransaction).type
            : (a as PaymentRecord).status;
        bVal =
          type === "wallet"
            ? (b as WalletTransaction).type
            : (b as PaymentRecord).status;
        break;
      default:
        return 0;
    }
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const limit = parseInt(entriesPerPage, 10);
  const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
  const paginated = sorted.slice(currentPage * limit, (currentPage + 1) * limit);
  const showingFrom = sorted.length === 0 ? 0 : currentPage * limit + 1;
  const showingTo = Math.min((currentPage + 1) * limit, sorted.length);

  return (
    <div>
      {/* Controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Show</span>
          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(e.target.value);
              setCurrentPage(0);
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {ENTRIES_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span>Entries</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(0);
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-700 font-semibold">
              <th
                className="px-4 py-3 cursor-pointer select-none"
                onClick={() => handleSort("id")}
              >
                # <SortIcon />
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none"
                onClick={() => handleSort("amount")}
              >
                Amount <SortIcon />
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none"
                onClick={() => handleSort("action")}
              >
                Payment Action <SortIcon />
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none"
                onClick={() => handleSort("date")}
              >
                Payment Date <SortIcon />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-gray-500 font-semibold bg-gray-50"
                >
                  No Data Available In Table
                </td>
              </tr>
            ) : (
              paginated.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {currentPage * limit + index + 1}
                  </td>
                  <td className="px-4 py-3">
                    Rs {item.amount.toLocaleString()}.00
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {type === "wallet"
                      ? (item as WalletTransaction).type
                      : (item as PaymentRecord).status}
                  </td>
                  <td className="px-4 py-3">{formatDate(item.date)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <p className="text-sm text-gray-500 mt-3">
        Showing {showingFrom} To {showingTo} Of {sorted.length} Entries
      </p>

      {/* Pagination buttons */}
      <div className="grid grid-cols-2 gap-0 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          className="bg-[#8B8B3D] text-white py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
          }
          disabled={currentPage >= totalPages - 1}
          className="bg-[#3D6B6B] text-white py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function WalletContent() {
  const dispatch = useAppDispatch();
  const balance = useAppSelector(selectWalletBalance);
  const transactions = useAppSelector(selectWalletTransactions);
  const payments = useAppSelector(selectWalletPayments);
  const selectedPaymentMethod = useAppSelector(selectSelectedPaymentMethod);

  const [activeTab, setActiveTab] = useState<TabType>("add");
  const [amount, setAmount] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvc, setCvc] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function resetForm() {
    setAmount("");
    setCardName("");
    setCardNumber("");
    setCvc("");
    setMonth("");
    setYear("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;
    if (!cardNumber) return;

    const lastFour = cardNumber.slice(-4);
    dispatch(
      addFunds({
        amount: parsedAmount,
        paymentMethod: selectedPaymentMethod,
        cardLastFour: lastFour,
      })
    );
    resetForm();
    setSuccessMessage("Amount added successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  }

  const paymentMethods: { key: PaymentMethodType; label: string }[] = [
    { key: "visa", label: "VISA" },
    { key: "mastercard", label: "MasterCard" },
    { key: "jazzcash", label: "JazzCash" },
  ];

  const tabHeadings: Record<TabType, { prefix: string; bold: string }> = {
    add: { prefix: "My ", bold: "Wallet" },
    history: { prefix: "My ", bold: "Wallet History" },
    payments: { prefix: "My ", bold: "PAYMENT HISTORY" },
  };

  const heading = tabHeadings[activeTab];

  return (
    <div>
      {/* Heading */}
      <h1 className="text-2xl text-center mb-6">
        <span className="underline">
          {heading.prefix}
          <span className="font-bold text-[#E8B800] underline">
            {heading.bold}
          </span>
        </span>
      </h1>

      {/* Gold info bar */}
      <div className="bg-[#E8B800] rounded px-6 py-3 flex items-center justify-between mb-8">
        <span className="text-white text-sm">Home Page / My Wallet</span>
        <span className="text-white text-sm font-semibold uppercase">
          Current Amount {balance.toLocaleString()}.00 Rs
        </span>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        <ProfileSidebar activeItem="wallet" />

        <div className="flex-1 min-w-0">
          {/* Tab bar */}
          <div className="grid grid-cols-3 mb-6">
            {(
              [
                { key: "add", label: "Add Amount" },
                { key: "history", label: "Wallet History" },
                { key: "payments", label: "Payment History" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 text-sm font-semibold transition-colors ${activeTab === tab.key
                    ? "bg-[#3D6B6B] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "add" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success message */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
                  {successMessage}
                </div>
              )}

              {/* Payment method cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.key}
                    type="button"
                    onClick={() =>
                      dispatch(setSelectedPaymentMethod(method.key))
                    }
                    className={`border-2 rounded-lg py-6 text-center font-bold text-lg transition-colors ${selectedPaymentMethod === method.key
                        ? "border-[#E8B800] bg-yellow-50"
                        : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                <Input
                  label="Enter Amount"
                  type="number"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  required
                />
                <Input
                  label="Card Name"
                  placeholder="Card Name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Card Number"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                  <Input
                    label="Verification Number (CVC)"
                    placeholder="CVC"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Chose The Month"
                    options={MONTH_OPTIONS}
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                  />
                  <Select
                    label="Chose The Year"
                    options={YEAR_OPTIONS}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                Add Amount
              </Button>
            </form>
          )}

          {activeTab === "history" && (
            <HistoryTable data={transactions} type="wallet" />
          )}

          {activeTab === "payments" && (
            <HistoryTable data={payments} type="payment" />
          )}
        </div>
      </div>
    </div>
  );
}
