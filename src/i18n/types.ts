export type I18nResource = {
  common: {
    buttons: {
      download: string;
      globalSearch: string;
    },
    pagination: {
      pageOf: string;
      rowsPer: string;
    },
    table: {
      viewOptions: {
        title: string;
        menuTitle: string;
      };
    }
  };
  dashboard: {
    title: string;
    tabs: {
      overview: string;
      analytics: string;
      reports: string;
      notifications: string;
    }
  },
  users: {
    list: {
      title: string;
      description: string;
      buttons: {
        add: string;
      },
      table: {
        searchPlaceholder: string;
        noResults: string;
        filters: {
          name: string;
          status: string;
          roles: string;
        },
        headers: {
          username: string;
          fullName: string;
          cpf: string;
          email: string;
          status: string;
          roles: string;
        },
        columns: {
          actions: {
            view: string;
            delete: string;
          }
        },
      }
    },
    create: {
      title: string;
      description: string;
      submit: {
        message: string;
      },
      form: {
        cpf: {
          label: string;
          placeholder: string;
          validation: {
            required: string;
            invalid: string;
          }
        },
        fullname: {
          label: string;
          placeholder: string;
          validation: {
            required: string;
          }
        },
        email: {
          label: string;
          placeholder: string;
          validation: {
            invalid: string;
          }
        },
        roles: {
          label: string;
          selectionPlaceholder: string;
          placeholder: string;
          notFound: string;
          validation: {
            required: string;
          }
        },
        description: {
          label: string;
          placeholder: string;
        },
      }
      actions: {
        create: string;
        cancel: string;
      }
    }
  }
};


type Join<K, P> = K extends string
  ? P extends string
    ? `${K}.${P}`
    : never
  : never;

type Leaves<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? Join<K & string, Leaves<T[K]>>
        : K & string;
    }[keyof T]
  : never;

type I18nKey = Leaves<I18nResource>;
export const i18nResourceMessage = <T extends I18nKey>(key: T) => key;