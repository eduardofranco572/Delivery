import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Category, Product } from '../../core/models/domain.models';

const GET_CATALOG = gql`
    query GetCatalog {
        catalog {
            id
            catName
            products {
                id
                prodName
                prodDescription
                prodOriginalPrice
                prodPromotionalPrice
                prodImageUrl
            }
        }
    }
`;

const GET_PRODUCT_DETAILS = gql`
    query GetProductDetails($id: Int!) {
        productDetails(id: $id) {
            id
            prodName
            prodDescription
            prodOriginalPrice
            prodPromotionalPrice
            prodImageUrl
            preferenceGroups {
                id
                name
                preferences {
                    id
                    prefName
                    prefPrice
                }
            }
        }
    }
`;

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    constructor(private apollo: Apollo) {}

    getCatalog(): Observable<Category[]> {
        return this.apollo.watchQuery<{catalog: Category[]}>({
            query: GET_CATALOG
        }).valueChanges.pipe(
            map(result => (result.data?.catalog as Category[]) || [])
        );
    }

    getProductDetails(id: number): Observable<Product> {
        return this.apollo.query<{productDetails: Product}>({
            query: GET_PRODUCT_DETAILS,
            variables: { id },
            fetchPolicy: 'network-only'
        }).pipe(
            map(result => {
                if (!result.data?.productDetails) {
                    throw new Error('Produto não encontrado');
                }
                return result.data.productDetails as Product;
            })
        );
    }
}