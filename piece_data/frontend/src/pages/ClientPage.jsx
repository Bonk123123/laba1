import axios from "axios";
import React from "react";
import { Form, useNavigate } from "react-router-dom";

const ClientPage = () => {
  const navigate = useNavigate();

  const [users, setUsers] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [activeOrder, setActiveOrder] = React.useState(0);
  const [modal, setModal] = React.useState(false);
  const [modalAdd, setModalAdd] = React.useState(false);
  const [productId, setProductId] = React.useState([]);
  const [productId2, setProductId2] = React.useState([]);
  const [productsList, setProductsList] = React.useState([]);
  const [productsList2, setProductsList2] = React.useState([]);
  const [price, setPrice] = React.useState([]);
  const [curmon, setCurmon] = React.useState(0);
  const [com, setCom] = React.useState("ok");
  const [activePay, setActivePay] = React.useState(0);

  React.useEffect(() => {
    axios
      .get("http://localhost:8080/user")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => console.log(error));
    axios
      .get("http://localhost:8080/product")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = (event) => {
    for (let i = 0; i < productsList.length; i++) {
      axios.post("http://localhost:8080/order", {
        userId: activeOrder,
        productId: productId[i],
        product: productsList[i],
        price: price[i],
        activePay: activePay,
        productId2: productId2[0],
      });
    }
    setModal(false);
    navigate(0);
    event.preventDefault();
  };

  const sum = () => {
    let s = 0;
    price.forEach((p) => {
      s += p;
    });
    return s;
  };

  const str = () => {
    let s = "";
    productsList.forEach((p) => {
      s += p;
      s += ", ";
    });
    return s;
  };

  const str2 = () => {
    let s = "";
    productsList2.forEach((p) => {
      s += p;
      s += ", ";
    });
    return s;
  };

  const handleSubmitCreate = (event) => {
    axios.post("http://localhost:8080/user", {
      current_money: curmon,
      comment: com,
    });
    navigate(0);
    event.preventDefault();
  };

  return (
    <div className="flex w-full h-full">
      {modalAdd ? (
        <div className="absolute bg-white border backdrop w-[80%] h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="border w-full h-1/6 flex justify-center items-center gap-5">
            <p className="text-center">Создать клиента</p>
          </span>
          <Form
            id="client"
            method="post"
            action="/user"
            onSubmit={handleSubmitCreate}
            className="w-full h-4/6 flex justify-center items-center gap-5"
          >
            <input
              className="border"
              defaultValue="current_money"
              value={curmon}
              onChange={(e) => setCurmon(e.target.value)}
            />
            <input
              className="border"
              defaultValue="ok"
              value={com}
              onChange={(e) => setCom(e.target.value)}
            />
          </Form>
          <span className="border w-full h-1/6 flex justify-center items-center gap-5">
            <button type="submit" form="client" className="text-center">
              отправить
            </button>
          </span>
        </div>
      ) : (
        <></>
      )}
      <span
        className="absolute text-3xl top-3 right-3 cursor-pointer"
        onClick={() => setModalAdd((prev) => !prev)}
      >
        &#43;
      </span>
      <table className="w-3/4 h-full m-5 border rounded">
        <thead className="border text-center">
          <tr>
            <th className="w-10">id</th>
            <th>сумма покупок</th>
            <th>текущий счёт</th>
            <th>потолок кредита</th>
            <th>текщий долг</th>
            <th>остаток кредита</th>
            <th>комментарий</th>
            <th>добавить заказ</th>
          </tr>
        </thead>
        <tbody className="border text-center">
          {users.map((user) => {
            return (
              <tr key={user.id}>
                <td className="w-10">{user.id}</td>
                <td>{user.sumbuy}</td>
                <td>{user.current_money}</td>
                <td>{user.max_duty}</td>
                <td
                  style={{
                    backgroundColor:
                      (user.max_duty - user.current_duty) / user.max_duty <= 0.1
                        ? "#f75151"
                        : "white",
                  }}
                >
                  {user.current_duty === null ? "0" : user.current_duty}
                </td>
                <td>{user.loan_balance}</td>
                <td>{user.comment}</td>
                <td className="text-2xl cursor-pointer text-center flex w-full">
                  <p
                    className="w-1/2 text-2xl text-center"
                    onClick={() => {
                      setActiveOrder(user.id);
                      setModal((prev) => !prev);
                    }}
                  >
                    &#10009;
                  </p>
                  <p
                    className="w-1/2 text-lg text-center"
                    onClick={async () => {
                      await axios.delete(
                        `http://localhost:8080/order/${user.id}`
                      );
                      axios.delete(`http://localhost:8080/user/${user.id}`);
                      navigate(0);
                    }}
                  >
                    &#10005;
                  </p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {modal ? (
        <div className="absolute bg-white border backdrop w-[80%] h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <button
            className="absolute top-2 cursor-pointer right-2"
            onClick={() => setModal(false)}
          >
            &#10005;
          </button>
          <div className="border w-full h-1/6 flex justify-center items-center gap-5">
            <button
              style={{
                backgroundColor: activePay === 0 ? "#f2f2ed" : "white",
              }}
              className="border p-1"
              onClick={() => setActivePay(0)}
            >
              наличный расчёт
            </button>
            <button
              style={{
                backgroundColor: activePay === 1 ? "#f2f2ed" : "white",
              }}
              className="border p-1"
              onClick={() => setActivePay(1)}
            >
              безналичный расчёт
            </button>
            <button
              style={{
                backgroundColor: activePay === 2 ? "#f2f2ed" : "white",
              }}
              className="border p-1"
              onClick={() => setActivePay(2)}
            >
              в кредит
            </button>
            <button
              style={{
                backgroundColor: activePay === 3 ? "#f2f2ed" : "white",
              }}
              className="border p-1"
              onClick={() => {
                setActivePay(3);
                setProductId([]);
                setProductId2([]);
              }}
            >
              бартер
            </button>
          </div>

          {(activePay === 0 || activePay === 2) && (
            <div className="flex w-full h-4/6 justify-center items-center gap-[8%]">
              <Form
                id="sub"
                action={`/order`}
                method="post"
                onSubmit={handleSubmit}
                className="flex-col relative w-1/4 h-auto justify-center items-center"
              >
                <input
                  className="border flex-col w-full"
                  defaultValue={activeOrder}
                />
                <textarea
                  className="border flex-col w-full mt-2"
                  value={str()}
                />
                <input className="border flex-col w-full mt-2" value={sum()} />
              </Form>
              <table className="w-1/2 border rounded">
                <thead className="border text-center">
                  <tr>
                    <th className="w-10">id</th>
                    <th>товар</th>
                    <th>кол-во товаров</th>
                    <th>цена</th>
                  </tr>
                </thead>
                <tbody className="border text-center">
                  {products?.map((product, index) => {
                    return (
                      <tr
                        style={{
                          backgroundColor: productId?.includes(product.id)
                            ? "#f2f2ed"
                            : "white",
                        }}
                        className="cursor-pointer"
                        key={product.id}
                        onClick={() => {
                          if (productId.includes(product.id)) {
                            setProductId((prev) =>
                              prev.filter((item) => item !== product.id)
                            );
                            setProductsList((prev) =>
                              prev.filter((item) => item !== product.product)
                            );
                            setPrice((prev) =>
                              prev.filter((item) => item !== product.price)
                            );
                          } else {
                            setProductId((prev) => prev.concat(product.id));
                            setProductsList((prev) =>
                              prev.concat(product.product)
                            );
                            setPrice((prev) => prev.concat(product.price));
                          }
                        }}
                      >
                        <td className="w-10">{product.id}</td>
                        <td>{product.product}</td>
                        <td>{product.quantity_product}</td>
                        <td>{product.price}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activePay === 1 && (
            <div className="flex w-full h-4/6 justify-center items-center gap-[8%]">
              <Form
                id="sub"
                action={`/order`}
                method="post"
                onSubmit={handleSubmit}
                className="flex-col relative w-1/4 h-auto justify-center items-center"
              >
                <input
                  className="border flex-col w-full"
                  defaultValue={activeOrder}
                />
                <textarea
                  className="border flex-col w-full mt-2"
                  value={str()}
                />
              </Form>
              <table className="w-1/2 border rounded">
                <thead className="border text-center">
                  <tr>
                    <th className="w-10">id</th>
                    <th>товар</th>
                    <th>кол-во товаров</th>
                    <th>цена</th>
                  </tr>
                </thead>
                <tbody className="border text-center">
                  {products?.map((product, index) => {
                    return (
                      <tr
                        style={{
                          backgroundColor: productId?.includes(product.id)
                            ? "#f2f2ed"
                            : "white",
                        }}
                        className="cursor-pointer"
                        key={product.id}
                        onClick={() => {
                          if (productId.includes(product.id)) {
                            setProductId((prev) =>
                              prev.filter((item) => item !== product.id)
                            );
                            setProductsList((prev) =>
                              prev.filter((item) => item !== product.product)
                            );
                            setPrice((prev) =>
                              prev.filter((item) => item !== product.price)
                            );
                          } else {
                            setProductId((prev) => prev.concat(product.id));
                            setProductsList((prev) =>
                              prev.concat(product.product)
                            );
                            setPrice((prev) => prev.concat(product.price));
                          }
                        }}
                      >
                        <td className="w-10">{product.id}</td>
                        <td>{product.product}</td>
                        <td>{product.quantity_product}</td>
                        <td>{product.price}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activePay === 3 && (
            <div className="flex w-full h-4/6 justify-center items-center gap-[8%]">
              <Form
                id="sub"
                action={`/order`}
                method="post"
                onSubmit={handleSubmit}
                className="flex-col relative w-1/4 h-auto justify-center items-center"
              >
                <textarea
                  className="border flex-col w-full mt-2"
                  value={str()}
                />
                <textarea
                  className="border flex-col w-full mt-2"
                  value={str2()}
                />
              </Form>
              <table className="w-1/2 border rounded">
                <thead className="border text-center">
                  <tr>
                    <th className="w-10">id</th>
                    <th>товар</th>
                    <th>кол-во товаров</th>
                    <th>цена</th>
                  </tr>
                </thead>
                <tbody className="border text-center">
                  {products?.map((product, index) => {
                    return (
                      <tr
                        style={{
                          backgroundColor: productId?.includes(product.id)
                            ? "#f2f2ed"
                            : "white",
                        }}
                        className="cursor-pointer"
                        key={product.id}
                        onClick={() => {
                          setProductId([]);
                          setProductId((prev) => prev.concat(product.id));
                          setProductsList([]);
                          setProductsList((prev) =>
                            prev.concat(product.product)
                          );
                        }}
                      >
                        <td className="w-10">{product.id}</td>
                        <td>{product.product}</td>
                        <td>{product.quantity_product}</td>
                        <td>{product.price}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <table className="w-1/2 border rounded">
                <thead className="border text-center">
                  <tr>
                    <th className="w-10">id</th>
                    <th>товар</th>
                    <th>кол-во товаров</th>
                    <th>цена</th>
                  </tr>
                </thead>
                <tbody className="border text-center">
                  {products?.map((product, index) => {
                    return (
                      <tr
                        style={{
                          backgroundColor: productId2?.includes(product.id)
                            ? "#f2f2ed"
                            : "white",
                        }}
                        className="cursor-pointer"
                        key={product.id}
                        onClick={() => {
                          setProductId2([]);
                          setProductId2((prev) => prev.concat(product.id));
                          setProductsList2([]);
                          setProductsList2((prev) =>
                            prev.concat(product.product)
                          );
                        }}
                      >
                        <td className="w-10">{product.id}</td>
                        <td>{product.product}</td>
                        <td>{product.quantity_product}</td>
                        <td>{product.price}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="h-1/6 border flex justify-center items-center">
            <button type="submit" form="sub" className="border p-1">
              отправить
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ClientPage;
