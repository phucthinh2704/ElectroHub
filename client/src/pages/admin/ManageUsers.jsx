import {
	ShieldUser,
	UserCheck,
	UserLock,
	UserPlus,
	UserRoundPen,
	UserRoundSearch,
	UserRoundX,
	Users,
} from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { apiBlockUser, apiDeleteUser, apiGetAllUsers } from "../../apis/user";
import EditUserForm from "../../components/admin/form/EditUserForm";
import Pagination from "../../components/public/pagination/Pagination";

const ManageUsers = () => {
	const [users, setUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterRole, setFilterRole] = useState("all");
	const [filterStatus, setFilterStatus] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [showEditForm, setShowEditForm] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [usersPerPage] = useState(5);

	const navigate = useNavigate();
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await apiGetAllUsers();
				if (response.success) setUsers(response.users);
			} catch (e) {
				console.log("Error fetching users:", e.message || e);
			}
		};
		fetchUsers();

		const params = new URLSearchParams(window.location.search);
		const page = params.get("page") || 1;
		setCurrentPage(Number(page));
	}, []);

	// Filter users based on search and filters
	const filteredUsers = users.filter((user) => {
		const matchesSearch =
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.mobile.includes(searchTerm.toLowerCase());
		const matchesRole = filterRole === "all" || user.role === filterRole;
		const matchesStatus =
			filterStatus === "all" ||
			(filterStatus === "active" && !user.isBlocked) ||
			(filterStatus === "blocked" && user.isBlocked);

		return matchesSearch && matchesRole && matchesStatus;
	});

	const handleFilterChange = (field, value) => {
		switch (field) {
			case "search":
				setSearchTerm(value);
				break;
			case "role":
				setFilterRole(value);
				break;
			case "status":
				setFilterStatus(value);
				break;
		}
		const params = new URLSearchParams(window.location.search);
		params.set("page", 1);
		setCurrentPage(1);
		navigate({
			pathname: window.location.pathname,
			search: params.toString(),
		});
	};

	// Pagination
	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
	// const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

	const handleEdit = (userId) => {
		setSelectedUserId(userId);
		setShowEditForm(true);
	};

	const handleDelete = (userId) => {
		Swal.fire({
			title: "Are you sure delete this user?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const response = await apiDeleteUser(userId);
					if (response.success) {
						setUsers(users.filter((user) => user._id !== userId));
						if (currentUsers.length === 1 && currentPage > 1) {
							console.log(
								"No users on current page, going back one page"
							);
							setCurrentPage(currentPage - 1);
							navigate({
								pathname: window.location.pathname,
								search: `?page=${currentPage - 1}`,
							});
						}
						toast.success(response.message);
					} else {
						toast.error(
							response.message || "Failed to delete user"
						);
					}
				} catch (e) {
					console.error("Error deleting user:", e.message || e);
				}
			}
		});
	};

	const handleBlock = async (userId) => {
		try {
			const response = await apiBlockUser(userId);
			if (response.success) {
				setUsers(
					users.map((user) =>
						user._id === userId
							? { ...user, isBlocked: !user.isBlocked }
							: user
					)
				);
				toast.success(response.message);
			} else {
				toast.error(response.message || "Failed to block user");
			}
		} catch (e) {
			console.error("Error blocking user:", e.message || e);
		}
	};

	const getRoleBadgeColor = (role) => {
		switch (role) {
			case "admin":
				return "bg-red-100 text-red-800 border-red-200";
			case "moderator":
				return "bg-blue-100 text-blue-800 border-blue-200";
			default:
				return "bg-gray-200 text-gray-800 border-gray-200";
		}
	};

	const getStatusBadgeColor = (isBlocked) => {
		return isBlocked
			? "bg-red-100 text-red-800 border-red-200 uppercase"
			: "bg-green-100 text-green-800 border-green-200 uppercase";
	};

	const getPaginationInfo = (currentPage, pageSize, totalUsers) => {
		const startItem = (currentPage - 1) * pageSize + 1;
		const endItem = Math.min(currentPage * pageSize, totalUsers);

		return { startItem, endItem };
	};
	const { startItem, endItem } = getPaginationInfo(
		currentPage,
		usersPerPage,
		filteredUsers.length
	);

	return (
		<div className="p-4 bg-slate-100 min-h-screen">
			{/* Header */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-3xl font-bold text-slate-800 mb-2 uppercase">
							Manage Users
						</h1>
						<p className="text-slate-600">
							Manage and monitor all users in your system
						</p>
					</div>
					<button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
						<UserPlus />
						Add New User
					</button>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-slate-600 text-sm font-medium">
									Total Users
								</p>
								<p className="text-2xl font-bold text-slate-800">
									{users.length}
								</p>
							</div>
							<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
								<Users
									color="blue"
									size={28}
								/>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-slate-600 text-sm font-medium">
									Active Users
								</p>
								<p className="text-2xl font-bold text-green-600">
									{users.filter((u) => !u.isBlocked).length}
								</p>
							</div>
							<div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
								<UserCheck
									color="green"
									size={28}
								/>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-slate-600 text-sm font-medium">
									Blocked Users
								</p>
								<p className="text-2xl font-bold text-red-600">
									{users.filter((u) => u.isBlocked).length}
								</p>
							</div>
							<div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
								<UserLock
									color="red"
									size={28}
								/>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-slate-600 text-sm font-medium">
									Admin Users
								</p>
								<p className="text-2xl font-bold text-purple-600">
									{
										users.filter((u) => u.role === "admin")
											.length
									}
								</p>
							</div>
							<div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
								{/* <div className="w-6 h-6 bg-purple-600 rounded-full"></div> */}
								<ShieldUser
									color="purple"
									size={28}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Filters and Search */}
				<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6 text-black">
					<div className="flex flex-col md:flex-row gap-4">
						{/* Search */}
						<div className="flex-1">
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
									<UserRoundSearch />
								</div>
								<input
									type="text"
									placeholder="Search users by name, email or phone number..."
									value={searchTerm}
									onChange={(e) =>
										handleFilterChange(
											"search",
											e.target.value
										)
									}
									className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
								/>
							</div>
						</div>

						{/* Role Filter */}
						<select
							value={filterRole}
							onChange={(e) =>
								handleFilterChange("role", e.target.value)
							}
							className="px-4 py-3 border uppercase border-slate-300 rounded-xl hover:shadow-lg focus:outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white">
							<option value="all">All Roles</option>
							<option value="admin">Admin</option>
							<option value="moderator">Moderator</option>
							<option value="user">User</option>
						</select>

						{/* Status Filter */}
						<select
							value={filterStatus}
							onChange={(e) =>
								handleFilterChange("status", e.target.value)
							}
							className="px-4 py-3 border uppercase border-slate-300 rounded-xl focus:ring-2 hover:shadow-lg focus:outline-none cursor-pointer focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white">
							<option value="all">All Status</option>
							<option value="active">Active</option>
							<option value="blocked">Blocked</option>
						</select>
					</div>
				</div>
			</div>

			{/* Users Table */}
			<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-slate-50 border-b border-slate-200">
							<tr className="text-center">
								<th className="py-4 px-6 font-semibold text-slate-700">
									#
								</th>
								<th className="py-4 px-6 font-semibold text-slate-700">
									User
								</th>
								<th className="py-4 px-6 font-semibold text-slate-700">
									Contact
								</th>
								<th className="py-4 px-10 font-semibold text-slate-700">
									Status
								</th>
								<th className="py-4 px-6 font-semibold text-slate-700">
									Role
								</th>
								<th className="py-4 px-6 font-semibold text-slate-700">
									Joined
								</th>
								<th className="py-4 px-6 font-semibold text-slate-700">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200">
							{currentUsers.map((user, index) => (
								<tr
									key={user._id}
									className="text-center hover:bg-slate-200 transition-colors duration-150">
									<td className="py-4 px-6 text-slate-600 font-semibold">
										{indexOfFirstUser + index + 1}
									</td>

									{/* User Info */}
									<td className="py-4 px-6 text-left">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
												{user.avatar ? (
													<img
														src={user.avatar}
														alt={user.name}
														className="w-full h-full rounded-full object-cover"
													/>
												) : (
													<>
														{user.name
															.charAt(0)
															.toUpperCase()}
													</>
												)}
											</div>
											<div>
												<p className="font-medium text-slate-800">
													{user.name}
												</p>
												<p className="text-sm text-slate-500">
													{user.email}
												</p>
											</div>
										</div>
									</td>

									{/* Contact */}
									<td className="py-4 px-6">
										<p className="text-slate-700">
											{user.mobile}
										</p>
									</td>

									{/* Status */}
									<td>
										<span
											className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
												user.isBlocked
											)}`}>
											<div
												className={`w-2 h-2 rounded-full mr-2 ${
													user.isBlocked
														? "bg-red-500"
														: "bg-green-500"
												}`}></div>
											{user.isBlocked
												? "Blocked"
												: "Active"}
										</span>
									</td>

									{/* Role */}
									<td className="py-4 px-6">
										<span
											className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border uppercase ${getRoleBadgeColor(
												user.role
											)}`}>
											{user.role}
										</span>
									</td>

									{/* Created At */}
									<td className="py-4 px-6 text-slate-600">
										{moment(user.createdAt).format(
											"DD/MM/YYYY"
										)}
									</td>

									{/* Actions */}
									<td className="py-4 px-6">
										<div className="flex items-center gap-2">
											<button
												onClick={() =>
													handleBlock(user._id)
												}
												className={`p-2 rounded-lg transition-colors duration-150 cursor-pointer ${
													user.isBlocked
														? "text-green-600 hover:bg-green-50"
														: "text-orange-600 hover:bg-orange-50"
												}`}
												title={
													user.isBlocked
														? "Unblock User"
														: "Block User"
												}>
												<div className="w-4 h-4 bg-current rounded"></div>
											</button>
											<button
												onClick={() => {
													handleEdit(user._id);
													setShowEditForm(true);
												}}
												className="p-2 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
												title="Edit User">
												<UserRoundPen />
											</button>
											<button
												onClick={() =>
													handleDelete(user._id)
												}
												className="p-2 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
												title="Delete User">
												<UserRoundX />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="flex items-center justify-between px-10 py-5 bg-slate-50">
					<div>
						{users.length > 0 && (
							<div className="text-sm text-gray-500">
								Showing {filteredUsers.length} user
								{filteredUsers.length !== 1 ? "s" : ""}
							</div>
						)}
						<div className="text-sm text-slate-600">
							Show users {startItem} - {endItem} of{" "}
							{filteredUsers.length}
						</div>
					</div>
					<Pagination
						totalCount={filteredUsers.length}
						currentPage={currentPage}
						onPageChange={setCurrentPage}
						pageSize={usersPerPage}
						siblingCount={1}
					/>
				</div>
				{/* {totalPages > 1 && (
					<div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
						<div className="text-sm text-slate-600">
							Showing {indexOfFirstUser + 1} to{" "}
							{Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
							{filteredUsers.length} users
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={() =>
									setCurrentPage((prev) =>
										Math.max(prev - 1, 1)
									)
								}
								disabled={currentPage === 1}
								className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed">
								Previous
							</button>

							{[...Array(totalPages)].map((_, i) => (
								<button
									key={i + 1}
									onClick={() => setCurrentPage(i + 1)}
									className={`px-3 py-2 text-sm rounded-lg transition-colors duration-150 ${
										currentPage === i + 1
											? "bg-blue-600 text-white"
											: "text-slate-600 hover:bg-slate-200"
									}`}>
									{i + 1}
								</button>
							))}

							<button
								onClick={() =>
									setCurrentPage((prev) =>
										Math.min(prev + 1, totalPages)
									)
								}
								disabled={currentPage === totalPages}
								className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed">
								Next
							</button>
						</div>
					</div>
				)} */}
			</div>

			{/* Empty State */}
			{filteredUsers.length === 0 && (
				<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
					<div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<div className="w-8 h-8 bg-slate-400 rounded-full"></div>
					</div>
					<h3 className="text-lg font-semibold text-slate-800 mb-2">
						No users found
					</h3>
					<p className="text-slate-600">
						Try adjusting your search or filter criteria
					</p>
				</div>
			)}
			{/* Edit User Form */}
			{showEditForm && (
				<div
					className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setShowEditForm(false);
							setSelectedUserId(null);
						}
					}}>
					<EditUserForm
						users={users}
						setUsers={setUsers}
						selectedUserId={selectedUserId}
						onClose={() => {
							setShowEditForm(false);
							setSelectedUserId(null);
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default ManageUsers;
