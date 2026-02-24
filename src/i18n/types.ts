export type I18nResource = {
  common: {
    sidebar: {
      user: {
        title: string;
      },
      groups: {
        title: string;
        items: {
          dashboard: string;
          projects: string;
          forms: string;
          liabilities: string;
          chats: string;
          users: string;
          profiles: string;
        }
      },
      others: {
        title: string;
        items: {
          settings: {
            title: string;
            items: {
              profile: string;
              account: string;
              notifications: string;
            }
          },
          help: {
            title: string;
          }
        }
      }
    },
    themes: {
      light: string;
      dark: string;
      system: string;
    },
    command: {
      menu: {
        input: string;
        empty: string;
        theme: string;
      }
    },
    comming: {
      title: string;
      description: string;
    },
    buttons: {
      download: string;
      globalSearch: string;
      continue: string;
      cancel: string;
      back: string;
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
    },
    navigation: {
      profile: string;
      billing: string;
      settings: string;
      newTeam: string;
      signOut: string;
      toggleTheme: string;
    },
    dialogs: {
      signOut: {
        title: string;
        description: string;
        confirmText: string;
      }
    },
    dropdown: {
      upgradeToPro: string;
      account: string;
      billing: string;
      notifications: string;
      signOut: string;
    },
    team: {
      label: string;
      addTeam: string;
    },
    deleteDialog: {
      single: {
        title: string;
        description: string;
      },
      multi: {
        title: string;
        description: string;
        deafultConfirmWord: string;
      },
      confirm: {
        label: string;
        placeholder: string;
        keyword: string;
        keywordPlaceholder: string;
      },
      warning: {
        title: string;
        description: string;
      },
      confirmButton: string;
    }
  };
  dashboard: {
    title: string;
    tabs: {
      overview: string;
      analytics: string;
      reports: string;
      notifications: string;
      nav: {
        overview: string;
        costumers: string;
        products: string;
        settings: string;
      }
    }
  },
  forms: {
    create: {
      form_builder: {
        form: {
          defaultValues: {
            title: string;
            description: string;
          },
          title: {
            placeholder: string;
            validation: {
              minLength: string;
              maxLength: string;
            }
          },
          description: {
            placeholder: string;
            validation: {
              minLength: string;
            }
          },
          project: {
            title: string;
            placeholder: string;
            empty: string;
            preselected: string;
          },
          questions: {
            alert: string;
            empty: {
              title: string;
              description: string;
            },
            label: {
              validation: {
                required: string;
              }
            },
            validation: {
              minLength: string;
            },
            options: {
              label: {
                validation: {
                  required: string;
                }
              },
              validation: {
                minLength: string;
              }
            },
          }
        },
        dialog: {
          confirm: {
            title: string,
            description: string,
            confirm: string,
            cancel: string,
          },
        },
        validation: {
          title: {
            minLength: string;
            maxLength: string;
          },
          description: {
            minLength: string;
          },
          questions: {
            minArray: string;
          },
          options: {
            minArray: string;
          }
        }
      }
    },
    list: {
      title: string;
      description: string;
    }
  },
  profiles: {
    view: {
      title: string;
      notFound: {
        message: string;
      },
      buttons: {
        edit: string;
      }
    },
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
        };
        headers: {
          role: string;
          description: string;
          permissions: string;
        };
        columns: {
          actions: {
            view: string;
            edit: string;
            delete: string;
          }
        }
      }
    },
    create: {
      title: string;
      description: string;
      form: {
        name: {
          label: string;
          validation: {
            required: string;
          }
        },
        description: {
          label: string;
          placeholder: string;
        },
        permissions: {
          label: string;
          validation: {
            required: string;
          },
          search: {
            placeholder: string;
            expand: string;
            collapse: string;
          },
          featureGroup: {
            selected: string;
          }
        }
      },
      actions: {
        creationSubmitLabel: string;
        save: string;
        cancel: string;
      },
    },
    logs: {
      title: string;
      empty: string;
      permissions: {
        label: string;
      }
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
  },
  projects: {
    list: {
      title: string;
      description: string;
      buttons: {
        new: string;
        logs: string;
      },
      filters: {
        all: string;
        active: string;
        paused: string;
        finished: string;
        canceled: string;
        expired: string;
      },
      noResults: string;
      searchPlaceholder: string;
    },
    create: {
      title: string;
      form: {
        title: {
          label: string;
          validation: {
            required: string;
          }
        },
        description: {
          label: string;
          validation: {
            required: string;
          }
        },
        category: {
          label: string;
        },
        startDate: {
          label: string;
          validation: {
            required: string;
          }
        },
        endDate: {
          label: string;
          validation: {
            required: string;
          }
        },
        responsible: {
          label: string;
          validation: {
            required: string;
          }
        },
        budget: {
          label: string;
          validation: {
            positive: string;
          }
        },
        company: {
          label: string;
          validation: {
            required: string;
          }
        },
        customFields: {
          label: {
            validation: {
              required: string;
            }
          },
          value: {
            validation: {
              required: string;
            }
          }
        }
      }
    },
    edit: {
      title: string;
    },
    view: {
      title: string;
    }
  },
  passives: {
    list: {
      title: string;
      description: string;
      tabs: {
        overview: string;
        management: string;
        risks: string;
      },
      buttons: {
        new: string;
      },
      table: {
        searchPlaceholder: string;
        noResults: string;
      }
    }
  },
  chats: {
    title: string;
    tabs: {
      messages: string;
      support: string;
    },
    buttons: {
      new: string;
      send: string;
      call: string;
      video: string;
    },
    search: {
      placeholder: string;
    },
    messages: {
      noChat: string;
      typePlaceholder: string;
    }
  },
  settings: {
    title: string;
    navigation: {
      profile: string;
      account: string;
      notifications: string;
    },
    profile: {
      title: string;
      description: string;
      form: {
        name: {
          label: string;
          placeholder: string;
          validation: {
            required: string;
            invalid: string;
            maxLength: string;
          }
        },
        email: {
          label: string;
          placeholder: string;
          validation: {
            invalid: string;
          }
        },
        bio: {
          label: string;
          placeholder: string;
          validation: {
            minLength: string;
            maxLength: string;
          }
        },
        urls: {
          label: string;
          validation: {
            invalid: string;
          }
        }
      }
    },
    account: {
      title: string;
      description: string;
      form: {
        name: {
          label: string;
          validation: {
            required: string;
            minLength: string;
            maxLength: string;
          }
        },
        dob: {
          label: string;
        },
        language: {
          label: string;
        },
        theme: {
          label: string;
        }
      }
    },
    display: {
      title: string;
      form: {
        items: {
          label: string;
          validation: {
            required: string;
          }
        }
      }
    },
    notifications: {
      title: string;
      description: string;
      form: {
        email: {
          label: string;
        },
        push: {
          label: string;
        },
        sms: {
          label: string;
        }
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