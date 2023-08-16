import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

const passingName = "Johnson";
const failingName = "John";
const passingSurname = "Doe";
const failingSurname = "";
const passingEmail = "johnson@doe.com";
const failingEmail = "johnson@doe";

test('hata olmadan render ediliyor', () => {
    render(<IletisimFormu />)
});

test('iletişim formu headerı render ediliyor', () => {
    render(<IletisimFormu />)
    expect(screen.getByText("İletişim Formu")).toBeInTheDocument()
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu />)
    const nameInput = screen.getByLabelText("Ad*")
    userEvent.type(nameInput, failingName);
    await waitFor (()=> {
        expect(screen.queryAllByTestId("error").length).toBe(1)
        expect(
        screen.queryByText("Hata: ad en az 5 karakter olmalıdır.")
    ).toBeInTheDocument()})


});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />)
    userEvent.click(screen.getByText("Gönder"))
    const biDegisken = screen.getAllByTestId("error");
    await waitFor(()=> {
        expect(biDegisken.length).toBe(3)
    })

});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {

        render(<IletisimFormu />)
        const nameInput = screen.getByLabelText("Ad*")
        userEvent.type(nameInput,passingName);
        const surname = screen.getByLabelText("Soyad*")
        userEvent.type(surname,passingSurname);
        userEvent.click(screen.getByText("Gönder"));
        await waitFor(()=> {
            expect(screen.queryAllByTestId("error").length).toBe(1)
        })
    })

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {

    render(<IletisimFormu />)
    userEvent.type(
        screen.queryByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
        failingEmail
    );
    await waitFor(()=> {
        expect(
            screen.queryByText("Hata: email geçerli bir email adresi olmalıdır.")
        ).toBeInTheDocument();
    })
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    render(<IletisimFormu />)
    userEvent.type(screen.getByLabelText("Ad*"), passingName)
    userEvent.type(
        screen.queryByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
        passingEmail
    );
    userEvent.type(screen.getByLabelText("Mesaj"), "hello world");
    userEvent.click(screen.getByText("Gönder"))
    await waitFor(()=> {
        expect(
            screen.queryByText("Hata: soyad gereklidir.")
        ).toBeInTheDocument();
    })
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    render(<IletisimFormu />)
    userEvent.type(screen.getByLabelText("Ad*"), passingName)
    userEvent.type(
        screen.queryByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
        passingEmail
    );
    userEvent.type(screen.getByLabelText("Soyad*"), passingSurname);
    userEvent.click(screen.getByText("Gönder"))
    await waitFor(()=> {
        expect(screen.queryAllByTestId("error").length).toBe(0)
    })
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    render(<IletisimFormu />);
    userEvent.type(screen.getByPlaceholderText("İlhan"), passingName);
    userEvent.type(screen.getByPlaceholderText("Mansız"), passingSurname);
    userEvent.type(
      screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
      passingEmail
    );
    userEvent.type(
      screen.getByText("Mesaj"),
      "Bu bir deneme mesajıdır. Ödev başarıyla tamamlandı."
    );
    userEvent.click(screen.getByRole("button"));
    expect(await screen.findByTestId("firstnameDisplay")).toHaveTextContent(
      passingName
    );
    expect(await screen.findByTestId("lastnameDisplay")).toHaveTextContent(
      passingSurname
    );
    expect(await screen.findByTestId("emailDisplay")).toHaveTextContent(
      passingEmail
    );
    expect(await screen.findByTestId("messageDisplay")).toHaveTextContent(
      "Bu bir deneme mesajıdır. Ödev başarıyla tamamlandı."
    );
});
