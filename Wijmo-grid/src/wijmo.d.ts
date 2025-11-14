// Type definitions for Wijmo (loaded via CDN)
declare namespace wijmo {
  namespace grid {
    class FlexGrid {
      allowMerging: any;
      columns: any;
      itemsSource: any;
      [key: string]: any;
    }

    class GroupDescription {
      constructor(groupingFunction: (item: any) => any);
    }

    enum AllowMerging {
      None = 0,
      Cells = 1,
      ColumnHeaders = 2,
      RowHeaders = 4,
      All = 7,
    }

    enum Aggregate {
      None = 0,
      Sum = 1,
      Cnt = 2,
      Avg = 3,
      Max = 4,
      Min = 5,
      Rng = 6,
      Std = 7,
      StdPop = 8,
      Var = 9,
      VarPop = 10,
    }

    enum CellType {
      None = 0,
      Cell = 1,
      ColumnHeader = 2,
      RowHeader = 4,
      TopLeft = 8,
      BottomRight = 16,
    }
  }

  class CollectionView {
    groupDescriptions: any;
    refresh(): void;
    [key: string]: any;
  }
}

// Declare wijmo as a global variable (loaded from window.wijmo at runtime)
declare const wijmo: {
  grid: typeof wijmo.grid;
  CollectionView: new (items: any[]) => wijmo.CollectionView;
  [key: string]: any;
};

