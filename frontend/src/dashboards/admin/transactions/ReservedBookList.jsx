import React, { useEffect, useState } from "react";
import {
  exportBooks,
  getAllReservedBooks,
  unReservedBook,
  issueBook
} from "../../../http";

import { toast } from "react-hot-toast";
import { Pagination } from "../../../components";
import { formatDate } from "../../../utils/formatDate";

const ReservedBookList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});

  const handleExport = () => {
    const promise = exportBooks();
    toast.promise(promise, {
      loading: "Exporting...",
      success: (response) => {
        window.open(response?.data?.downloadUrl);
        return "Books Exported successfully";
      },
      error: (err) => {
        console.log(err);
        return "Something went wrong while exporting data.";
      },
    });
  };

  const handleUnreserveBook = async (_id) => {
      const promise = unReservedBook(_id);
      toast.promise(promise, {
        loading: "Loading...",
        success: () => {
          fetchData();
          return "Book Unreserved  successfully";
        },
        error: (err) => {
          console.log();
          return err?.response?.data?.message || "Something went wrong :(";
        },
      });
    }

    const handleIssueBook = (bookID, userID) => {
        /* ISSUE BOOK  */
        const promise = issueBook({
          bookID,
          userID
        });
        toast.promise(promise, {
          loading: "Issuing...",
          success: () => {
            fetchData();
            return "Book Issued successfully!";
          },
          error: (err) => {
            console.log();
            return err?.response?.data?.message || "Something went wrong!";
          },
        });
      };

  const fetchData = async () => {
    try {
      const { data } = await getAllReservedBooks(currentPage);
      console.log(data);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  /* FETCH DATA WHEN CURRENT PAGE CHANGE */
  useEffect(() => {
    fetchData();
  }, [currentPage]);



  return (
    <div className="manage__section bg">
      <div className="header">
        <h2>Reserved Books</h2>
      </div>


      <div className="table__wrapper" style={{ overflow: "auto" }}>
        <table className="background__accent" cellSpacing="0" cellPadding="0">
          <thead className="bg__secondary">
            <tr>
              <td>ISBN</td>
              <td>Title</td>
              <td>User Name</td>
              <td>Roll Number/Email</td>
              <td>Reserved Date</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {data?.books?.map((i) => {
              return (
                <tr key={i._id}>
                  <td>{i?.book?.ISBN}</td>
                  <td>{i.book?.title}</td>
                  <td>{i.user?.name}</td>
                  <td>
                    {i.user?.rollNumber ? (
                      <span>{i.user?.rollNumber}</span>
                    ) : (
                      <span>{i?.user?.email}</span>
                    )}
                  </td>

                  <td>{formatDate(i?.date)}</td>
                  <td>
                    <button className="btn btn__primary" onClick={()=>{handleIssueBook(i.book._id, i.user._id)}}>Issue</button>
                    <button className="btn btn__secondary" onClick={()=>{handleUnreserveBook(i._id)}}>Unreserve</button>
                  </td>
                
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        data={data}
      />

    </div>
  );
};

export default ReservedBookList;
