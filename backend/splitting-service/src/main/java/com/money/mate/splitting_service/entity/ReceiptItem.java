package com.money.mate.splitting_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "receipt_items")
public class ReceiptItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price;

    // public ReceiptItem() {
    // }

    // public ReceiptItem(String name, Double price) {
    // this.name = name;
    // this.price = price;
    // }

    // public Long getId() {
    // return id;
    // }

    // public void setId(Long id) {
    // this.id = id;
    // }

    // public String getName() {
    // return name;
    // }

    // public void setName(String name) {
    // this.name = name;
    // }

    // public Double getPrice() {
    // return price;
    // }

    // public void setPrice(Double price) {
    // this.price = price;
    // }

    // @Override
    // public boolean equals(Object o) {
    // if (this == o)
    // return true;
    // if (o == null || getClass() != o.getClass())
    // return false;
    // ReceiptItem that = (ReceiptItem) o;
    // return Objects.equals(id, that.id) &&
    // Objects.equals(name, that.name) &&
    // Objects.equals(price, that.price);
    // }

    // @Override
    // public int hashCode() {
    // return Objects.hash(id, name, price);
    // }

    // @Override
    // public String toString() {
    // return "ReceiptItem{" +
    // "id=" + id +
    // ", name='" + name + '\'' +
    // ", price=" + price +
    // '}';
    // }
}